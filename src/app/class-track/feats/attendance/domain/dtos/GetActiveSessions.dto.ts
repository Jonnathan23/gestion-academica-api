export class GetActiveSessionsDto {
    private constructor(public readonly statuses: string[]) {}

    public static create(object: { [key: string]: any }): [string?, GetActiveSessionsDto?] {
        const { statuses } = object;

        if (!statuses) return ["Missing statuses"];
        if (!Array.isArray(statuses)) return ["statuses must be an array"];
        if (statuses.length === 0) return ["statuses must not be empty"];

        return [undefined, new GetActiveSessionsDto(statuses)];
    }
}
