import type { SearchStudentsLevelsProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/search-students-levels.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class SearchStudentsLevelsDto {
    private constructor(
        public readonly searchTerm: string,
        public readonly limit: number,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<SearchStudentsLevelsProps>): SearchStudentsLevelsDto {
        const validatedData = validator.validate(object);

        const defaultLimit = 10;
        const limit = validatedData.limit ?? defaultLimit;
        const searchTerm = validatedData.searchTerm ? String(validatedData.searchTerm).trim() : "";

        return new SearchStudentsLevelsDto(searchTerm, limit);
    }
}
