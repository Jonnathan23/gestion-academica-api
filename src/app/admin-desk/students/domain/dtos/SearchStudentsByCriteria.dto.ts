import {
    certificateType,
    type CertificateType,
    studentContractStatus,
    type StudentContractStatus,
    studentProgressCategory,
    type StudentProgressCategory,
} from "@/core/interfaces/Students.interface";

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

    public static create(props: { [key: string]: any }): [string?, SearchStudentsByCriteriaDto?] {
        const { page, searchTerm, st_nationality, st_certificate_type, st_is_graduated, st_contract_status, st_progress_category } = props;

        if (page === undefined || page === null) {
            return ["El parámetro 'page' es requerido"];
        }

        let parsedPage = parseInt(page);
        if (isNaN(parsedPage) || parsedPage <= 0) {
            return ["El parámetro 'page' debe ser un número entero mayor a 0"];
        }

        if (st_certificate_type) {
            const validCertTypes = Object.values(certificateType);
            if (!validCertTypes.includes(st_certificate_type as CertificateType)) {
                return ["Valor inválido para 'st_certificate_type'"];
            }
        }

        if (st_contract_status) {
            const validStatuses = Object.values(studentContractStatus);
            if (!validStatuses.includes(st_contract_status as StudentContractStatus)) {
                return ["Valor inválido para 'st_contract_status'"];
            }
        }

        if (st_progress_category) {
            const validCategories = Object.values(studentProgressCategory);
            if (!validCategories.includes(st_progress_category as StudentProgressCategory)) {
                return ["Valor inválido para 'st_progress_category'"];
            }
        }

        let parsedIsGraduated: boolean | undefined = undefined;
        if (st_is_graduated !== undefined && st_is_graduated !== "") {
            parsedIsGraduated = st_is_graduated === "true" || st_is_graduated === true;
        }

        return [
            undefined,
            new SearchStudentsByCriteriaDto(
                parsedPage,
                searchTerm,
                st_nationality,
                st_certificate_type as CertificateType,
                parsedIsGraduated,
                st_contract_status as StudentContractStatus,
                st_progress_category as StudentProgressCategory,
            ),
        ];
    }
}
