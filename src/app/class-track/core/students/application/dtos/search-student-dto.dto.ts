import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { SearchStudentsProps } from "@/app/class-track/core/students/application/dtos/interfaces/search-students.interface";

export class SearchStudentsDto {
    private constructor(
        public readonly searchTerm: string,
        public readonly limit: number,
    ) {}

    public static create(props: Record<string, unknown>, validator: EntityValidator<SearchStudentsProps>): SearchStudentsDto {
        const validatedData = validator.validate(props);

        const trimmedTerm = validatedData.searchTerm.trim();

        let parsedLimit = 10;

        if (validatedData.limit !== undefined && validatedData.limit !== null) {
            const limitNumber = typeof validatedData.limit === "string" ? Number(validatedData.limit) : validatedData.limit;

            parsedLimit = limitNumber > 50 ? 50 : limitNumber;
        }

        return new SearchStudentsDto(trimmedTerm, parsedLimit);
    }
}
