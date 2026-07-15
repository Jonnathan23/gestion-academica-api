import type { CertificateType, StudentContractStatus } from "@/core/interfaces/students.interface";

export interface UpdateStudentProps {
    identificationCard?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    startDate?: string | Date;
    dateOfBirth?: string | Date;
    nationality?: string;
    certificateType?: CertificateType;
    contractStatus?: StudentContractStatus;
    isGraduated?: boolean | string;
}
