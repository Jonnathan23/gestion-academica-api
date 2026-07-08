import type { CertificateType } from "@/data/models/admin-desk/student.model";

export interface RegisterStudentProps {
    identificationCard: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    startDate: string | Date;
    dateOfBirth: string | Date;
    nationality: string;
    certificateType: CertificateType;
}
