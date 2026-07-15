import type { CertificateType, StudentContractStatus, StudentProgressCategory } from "@/core/interfaces/students.interface";

export interface SearchStudentsByCriteriaProps {
    page: string | number;
    searchTerm?: string;
    st_nationality?: string;
    st_certificate_type?: CertificateType;
    st_is_graduated?: string | boolean;
    st_contract_status?: StudentContractStatus;
    st_progress_category?: StudentProgressCategory;
}
