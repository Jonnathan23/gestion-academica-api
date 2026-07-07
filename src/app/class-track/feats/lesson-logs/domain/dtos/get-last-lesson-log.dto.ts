import { Validators } from "@/core/utils";

export class GetLastLessonLogDto {
    private constructor(public readonly studentId: string) {}

    public static create(object: Record<string, unknown>): [string?, GetLastLessonLogDto?] {
        const { studentId } = object;

        if (!studentId || typeof studentId !== "string") {
            return ["studentId is missing or invalid", undefined];
        }

        if (!Validators.isUUID(studentId)) {
            return ["studentId must be a valid UUID", undefined];
        }

        return [undefined, new GetLastLessonLogDto(studentId)];
    }
}
