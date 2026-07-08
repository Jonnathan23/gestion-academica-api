export class GetStudentTimelineDto {
    private constructor(public readonly studentId: string) {}

    public static create(object: { [key: string]: any }): [string?, GetStudentTimelineDto?] {
        const { studentId } = object;

        if (!studentId) return ["Missing studentId"];

        // Basic UUID validation (or any string depending on actual rules)
        if (typeof studentId !== "string" || studentId.trim().length === 0) {
            return ["Invalid studentId"];
        }

        return [undefined, new GetStudentTimelineDto(studentId)];
    }
}
