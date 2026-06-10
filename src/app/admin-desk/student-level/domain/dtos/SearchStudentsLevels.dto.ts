export class SearchStudentsLevelsDto {
    private constructor(
        public readonly searchTerm: string,
        public readonly limit: number,
    ) {}

    public static create(object: { [key: string]: any }): [string?, SearchStudentsLevelsDto?] {
        const { searchTerm, limit } = object;
        let finalLimit = 10;

        if (limit !== undefined) {
            const parsedLimit = parseInt(limit, 10);
            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return ["limit must be a positive integer"];
            }
            finalLimit = parsedLimit;
        }

        const finalSearchTerm = searchTerm ? String(searchTerm).trim() : "";

        return [undefined, new SearchStudentsLevelsDto(finalSearchTerm, finalLimit)];
    }
}
