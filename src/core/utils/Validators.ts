import { certificateType, type CertificateType } from "@/core/interfaces/Students.interface";
import { userRoles, type UserRoles } from "@/core/interfaces";

export class Validators {
    public static isEmail(email: string): boolean {
        const emailRegularExpression = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        return emailRegularExpression.test(email);
    }

    public static isStrongPassword(password: string): boolean {
        const minPasswordLength: number = 6;

        return password.length >= minPasswordLength;
    }

    public static isRole(role: string): boolean {
        return Object.values(userRoles).includes(role as UserRoles);
    }

    public static isUUID(identifier: string): boolean {
        const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        return uuidRegex.test(identifier);
    }

    public static isIdentificationCard(identificationCard: string): boolean {
        const identificationCardRegex: RegExp = /^[0-9]{10}$/;

        return identificationCardRegex.test(identificationCard);
    }

    public static isPhoneNumber(phoneNumber: string): boolean {
        const phoneNumberRegex: RegExp = /^[0-9]{10}$/;

        return phoneNumberRegex.test(phoneNumber);
    }

    public static isMinValidateAge(date: string | Date, minAge?: number): boolean {
        const defaultMinAge: number = 4;
        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();

        return age >= (minAge ?? defaultMinAge);
    }

    public static isCertificateType(certificate: string): boolean {
        return Object.values(certificateType).includes(certificate as CertificateType);
    }

    public static isDate(dateValue: unknown): boolean {
        if (dateValue === undefined || dateValue === null) {
            return false;
        }

        const parsedDate = new Date(dateValue as string | number | Date);

        return !isNaN(parsedDate.getTime());
    }
}
