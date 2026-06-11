export class SearchStudentsDto {
    private constructor(
        public readonly searchTerm: string,
        public readonly limit: number,
    ) {}

    public static create(object: { [key: string]: unknown }): [string?, SearchStudentsDto?] {
        const { searchTerm, limit } = object;

        if (!searchTerm) {
            return ["Missing searchTerm parameter"];
        }

        if (typeof searchTerm !== "string") {
            return ["searchTerm must be a string"];
        }

        const trimmedTerm = searchTerm.trim();

        if (trimmedTerm.length < 2) {
            return ["searchTerm must be at least 2 characters long to perform a search"];
        }

        let parsedLimit = 10;
        if (limit !== undefined && limit !== null) {
            const limitNumber = Number(limit);
            if (Number.isNaN(limitNumber) || limitNumber <= 0) {
                return ["limit must be a valid positive number"];
            }

            parsedLimit = limitNumber > 50 ? 50 : limitNumber;
        }

        return [undefined, new SearchStudentsDto(trimmedTerm, parsedLimit)];
    }
}
