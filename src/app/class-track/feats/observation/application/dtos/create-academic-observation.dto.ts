export class CreateAcademicObservationDto {
    private constructor(
        public readonly studentId: string,
        public readonly teacherId: string,
        public readonly observation: string,
        public readonly deadline: Date | null,
    ) {}

    public static create(object: { [key: string]: any }): [string?, CreateAcademicObservationDto?] {
        const { studentId, teacherId, observation, deadline } = object;

        if (!studentId) return ["Missing studentId"];
        if (!teacherId) return ["Missing teacherId"];
        if (!observation) return ["Missing observation"];

        let validDeadline: Date | null = null;

        if (deadline) {
            validDeadline = deadline instanceof Date ? deadline : new Date(deadline);
            if (isNaN(validDeadline.getTime())) {
                return ["Invalid deadline. Must be a valid Date"];
            }
        }

        return [undefined, new CreateAcademicObservationDto(studentId, teacherId, observation, validDeadline)];
    }
}
