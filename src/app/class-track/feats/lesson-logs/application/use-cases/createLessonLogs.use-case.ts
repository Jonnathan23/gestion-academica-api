import type { StudentClassTrackRepository } from "@/app/class-track/core/students/domain/repositories/student.repository";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";
import { moduleLimitsDictionary } from "@/app/class-track/core/enums/ModuleLimits.enum";
import type { AttendanceSessionRepository } from "@/app/class-track/feats/attendance/domain/repositories/attendanceSession.repository";
import type { CreateLessonLogsDto } from "@/app/class-track/feats/lesson-logs/domain/dtos/CreateLessongLog.dto";
import type { LessonLogEntity } from "@/app/class-track/feats/lesson-logs/domain/entities/LessonLog.entity";
import type { LessonLogRepository } from "@/app/class-track/feats/lesson-logs/domain/repositories/lessonLog.repository";
import { CustomError } from "@/core/error";

export class CreateLessonLogsUseCase {
    constructor(
        private readonly repository: LessonLogRepository,
        private readonly studentRepository: StudentClassTrackRepository,
        private readonly attendanceSessionRepository: AttendanceSessionRepository,
    ) {}

    public async execute(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]> {
        await this.validate(dto);
        return await this.repository.createLessonLogs(dto);
    }

    private async validate(dto: CreateLessonLogsDto) {
        const { attendanceSessionId } = dto;

        const studentId = await this.validationAttendanceSession(attendanceSessionId);
        await this.validationStudent(studentId);
        await this.validationRangeLessons(dto.lessonsStudied);
    }

    private async validationRangeLessons(lessons: CreateLessonLogsDto["lessonsStudied"]): Promise<void> {
        if (lessons.length === 0) return;

        const firstLesson = lessons[0];
        if (!firstLesson) {
            throw CustomError.badRequest("Lessons are required");
        }
        const baseLevel = this.getLevelForLesson(firstLesson.lessonNumber);

        if (!baseLevel) {
            throw CustomError.badRequest("Invalid lesson number");
        }

        for (let i = 1; i < lessons.length; i++) {
            const currentLesson = lessons[i];
            if (!currentLesson) {
                continue;
            }
            const currentLevel = this.getLevelForLesson(currentLesson.lessonNumber);

            if (!currentLevel || currentLevel !== baseLevel) {
                throw CustomError.badRequest("Lessons must be from the same level");
            }
        }

        /* TODO: Para validar estrictamente contra el nivel actual (ej. A1, A2):
         * 1. Actualmente `validationStudent` obtiene la proyección `StudentWithLevelActive`
         *    cuyo `activeModule` es el UUID de la tabla intermedia o del módulo, no el nombre (A1, A2).
         * 2. Opciones para solucionarlo:
         *    a) [Recomendada] Actualizar el query SQL y la proyección `StudentWithLevelActive`
         *       en `student.datasource.impl.ts` y `activeStudentProjection.mapper.ts` para hacer un JOIN
         *       con la tabla `Modules` y retornar directamente el nombre del nivel ("A1", "A2").
         *    b) Inyectar el `ModuleRepository` (de admin-desk) en este UseCase a través del controlador
         *       para consultar el módulo por su ID.
         * 3. Una vez se tenga el nombre del módulo (ej. "A2"), buscar en `moduleLimitsDictionary`
         *    su límite máximo. Para el mínimo, buscar el límite del módulo anterior + 1.
         * 4. Validar que las lecciones iteradas caigan exactamente dentro de ese rango [minLimit, maxLimit].
         */
    }

    private async validationAttendanceSession(attendanceSessionId: string): Promise<string> {
        const attendanceSession = await this.attendanceSessionRepository.getAttendanceSessionById(attendanceSessionId);

        if (!attendanceSession) {
            throw CustomError.notFound("Session not found");
        }

        if (attendanceSession.atSeStatus !== attendanceSessionStatus.InProgress) {
            throw CustomError.badRequest("Session is not active");
        }

        return attendanceSession.atSeStudentId;
    }

    private async validationStudent(studentId: string): Promise<void> {
        const student = await this.studentRepository.findStudentWithLevelActive(studentId);

        if (!student.activeModule) {
            throw CustomError.badRequest("Student has no active module");
        }

        if (!student.isContractValid) {
            throw CustomError.badRequest("Student has no active contract");
        }
    }

    private getLevelForLesson(lessonNumber: number): string | null {
        if (lessonNumber < 1) return null;
        let minLimit = 1;

        const levels = Object.keys(moduleLimitsDictionary) as (keyof typeof moduleLimitsDictionary)[];

        for (const level of levels) {
            const maxLimit = moduleLimitsDictionary[level];
            if (lessonNumber >= minLimit && lessonNumber <= maxLimit) {
                return level;
            }
            minLimit = maxLimit + 1;
        }
        return null;
    }
}
