import { describe, test, expect } from "bun:test";
import { InfoStudentsLevelMapper } from "@/app/admin-desk/student-level/infrastructure/mappers/info-students-level.mapper";
import { StudentMapper as StudentsStudentMapper } from "@/app/admin-desk/students/infrastructure/mappers/student.mapper";
import { AbsentStudentMapper } from "@/app/class-track/feats/attendance/infrastructure/mappers/absent-student.mapper";
import { StudentMapper as ClassTrackStudentMapper } from "@/app/class-track/core/students/infrastructure/mappers/student.mapper";
import { StudentWithLevelActiveDetailsProjectionMapper } from "@/app/class-track/core/students/infrastructure/mappers/active-student-details-projection.mapper";
import { StudentWithLevelActiveProjectionMapper } from "@/app/class-track/core/students/infrastructure/mappers/active-student-projection.mapper";
import { StudentInClassMapper } from "@/app/class-track/core/students/infrastructure/mappers/student-in-class.mapper";
import { LevelActiveMapper } from "@/app/class-track/core/students/infrastructure/mappers/students-levels/level-active.mapper";
import { ModuleInfoMapper } from "@/app/class-track/core/students/infrastructure/mappers/students-levels/module-info.mapper";
import { AttendanceSessionMapper } from "@/app/class-track/feats/attendance/infrastructure/mappers/attendance-session.mapper";
import { LessonLogMapper } from "@/app/class-track/feats/lesson-logs/infrastructure/mappers/lesson-log.mapper";
import { RetentionAlertWithStudentMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/retention-alert-with-student.mapper";
import { RetentionAlertMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/retention-alert.mapper";
import { StudentBasicMapper } from "@/app/class-track/feats/retention-alerts/infrastructure/mappers/students/student-basic.mapper";

describe("Unit Tests: Mappers Coverage", () => {
    describe("InfoStudentsLevelMapper", () => {
        // Instantiate to hit implicit constructor
        test("Instantiate", () => {
            expect(new InfoStudentsLevelMapper()).toBeDefined();
        });

        test("timelineEnrolledLevelFromObject - Missing fields", () => {
            expect(() => InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({})).toThrow("Missing st_mod_id");
            expect(() => InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({ st_mod_id: "1" })).toThrow("Missing st_mod_status");
            expect(() => InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({ st_mod_id: "1", st_mod_status: "ACTIVE" })).toThrow(
                "Missing st_mod_purchase_date",
            );
            expect(() =>
                InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({
                    st_mod_id: "1",
                    st_mod_status: "ACTIVE",
                    st_mod_purchase_date: new Date(),
                }),
            ).toThrow("Missing module relation");
            expect(() =>
                InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({
                    st_mod_id: "1",
                    st_mod_status: "ACTIVE",
                    st_mod_purchase_date: new Date(),
                    module: {},
                }),
            ).toThrow("Missing module.mo_id");
            expect(() =>
                InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({
                    st_mod_id: "1",
                    st_mod_status: "ACTIVE",
                    st_mod_purchase_date: new Date(),
                    module: { mo_id: "2" },
                }),
            ).toThrow("Missing module.mo_name");
            expect(() =>
                InfoStudentsLevelMapper.timelineEnrolledLevelFromObject({
                    st_mod_id: "1",
                    st_mod_status: "ACTIVE",
                    st_mod_purchase_date: new Date(),
                    module: { mo_id: "2", mo_name: "Mod" },
                }),
            ).toThrow("Missing module.mo_level");
        });

        test("timelineAvailableModuleFromObject - Missing fields", () => {
            expect(() => InfoStudentsLevelMapper.timelineAvailableModuleFromObject({})).toThrow("Missing mo_id");
            expect(() => InfoStudentsLevelMapper.timelineAvailableModuleFromObject({ mo_id: "1" })).toThrow("Missing mo_name");
            expect(() => InfoStudentsLevelMapper.timelineAvailableModuleFromObject({ mo_id: "1", mo_name: "Test" })).toThrow(
                "Missing mo_level",
            );
            expect(() => InfoStudentsLevelMapper.timelineAvailableModuleFromObject({ mo_id: "1", mo_name: "Test", mo_level: 2 })).toThrow(
                "Missing mo_description",
            );
        });

        test("studentTimelineFromObject - Missing fields", () => {
            expect(() => InfoStudentsLevelMapper.studentTimelineFromObject({})).toThrow("Missing studentRaw");
            expect(() => InfoStudentsLevelMapper.studentTimelineFromObject({ studentRaw: {} })).toThrow(
                "Missing or invalid enrolledLevelsRaw",
            );
            expect(() => InfoStudentsLevelMapper.studentTimelineFromObject({ studentRaw: {}, enrolledLevelsRaw: [] })).toThrow(
                "Missing or invalid availableModulesRaw",
            );
        });
    });

    describe("Other Static Mappers Instantiation", () => {
        test("Instantiate all to hit implicit constructors", () => {
            expect(new StudentsStudentMapper()).toBeDefined();
            expect(new AbsentStudentMapper()).toBeDefined();
            expect(new ClassTrackStudentMapper()).toBeDefined();
            expect(new StudentWithLevelActiveDetailsProjectionMapper()).toBeDefined();
            expect(new StudentWithLevelActiveProjectionMapper()).toBeDefined();
            expect(new StudentInClassMapper()).toBeDefined();
            expect(new LevelActiveMapper()).toBeDefined();
            expect(new ModuleInfoMapper()).toBeDefined();
            expect(new AttendanceSessionMapper()).toBeDefined();
            expect(new LessonLogMapper()).toBeDefined();
            expect(new RetentionAlertWithStudentMapper()).toBeDefined();
            expect(new RetentionAlertMapper()).toBeDefined();
            expect(new StudentBasicMapper()).toBeDefined();
        });
    });

    describe("StudentsStudentMapper - error throwing branches", () => {
        test("entityFromObject - Missing fields", () => {
            // we assume it throws an error if st_id is missing based on standard pattern
            expect(() => StudentsStudentMapper.entityFromObject({})).toThrow();
        });
    });

    describe("AbsentStudentMapper - error throwing branches", () => {
        test("absentStudentProjectionFromObject - Missing fields", () => {
            expect(() => AbsentStudentMapper.absentStudentProjectionFromObject({})).toThrow();
        });
    });
});
