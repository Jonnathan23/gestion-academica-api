import { certificateType, type CertificateType } from "@/core/interfaces/Students.interface";
import { userRoles, type UserRoles } from "@/core/interfaces";

export class Validators {
    static isEmail(email: string): boolean {
        const emailRegularExpression = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegularExpression.test(email);
    }

    static isStrongPassword(password: string): boolean {
        return password.length >= 6;
    }

    static isRole(role: string): boolean {
        return Object.values(userRoles).includes(role as UserRoles);
    }

    static isUUID(identifier: string): boolean {
        const uuidRegex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        return uuidRegex.test(identifier);
    }

    static isIdentificationCard(identificationCard: string): boolean {
        const identificationCardRegex: RegExp = /^[0-9]{10}$/;
        return identificationCardRegex.test(identificationCard);
    }

    static isPhoneNumber(phoneNumber: string): boolean {
        const phoneNumberRegex: RegExp = /^[0-9]{10}$/;
        return phoneNumberRegex.test(phoneNumber);
    }

    static isMinValidateAge(date: string | Date, minAge: number = 4): boolean {
        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= minAge;
    }

    static isCertificateType(certificate: string): boolean {
        return Object.values(certificateType).includes(certificate as CertificateType);
    }

    static isDate(dateValue: unknown): boolean {
        if (dateValue === undefined || dateValue === null) {
            return false;
        }

        const parsedDate = new Date(dateValue);
        // getTime() devuelve NaN si la fecha es inválida, e isNaN() lo detecta
        return !isNaN(parsedDate.getTime());
    }
}
