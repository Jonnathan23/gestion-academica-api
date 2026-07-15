import type { CertificateType, StudentContractStatus, StudentProgressCategory } from "@/core/interfaces/students.interface";
import type { SearchStudentsByCriteriaProps } from "@/app/admin-desk/students/application/dtos/interfaces/search-students-by-criteria.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class SearchStudentsByCriteriaDto {
    private constructor(
        public readonly page: number,
        public readonly searchTerm?: string,
        public readonly st_nationality?: string,
        public readonly st_certificate_type?: CertificateType,
        public readonly st_is_graduated?: boolean,
        public readonly st_contract_status?: StudentContractStatus,
        public readonly st_progress_category?: StudentProgressCategory,
    ) {}

    public static create(
        props: Record<string, unknown>,
        validator: EntityValidator<SearchStudentsByCriteriaProps>,
    ): SearchStudentsByCriteriaDto {
        const validatedData = validator.validate(props);

        let parsedIsGraduated: boolean | undefined = undefined;

        if (validatedData.st_is_graduated !== undefined && validatedData.st_is_graduated !== "") {
            parsedIsGraduated = validatedData.st_is_graduated === "true" || validatedData.st_is_graduated === true;
        }

        return new SearchStudentsByCriteriaDto(
            Number(validatedData.page),
            validatedData.searchTerm,
            validatedData.st_nationality,
            validatedData.st_certificate_type,
            parsedIsGraduated,
            validatedData.st_contract_status,
            validatedData.st_progress_category,
        );
    }
}
