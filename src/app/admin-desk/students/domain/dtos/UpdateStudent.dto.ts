import type { CertificateType, StudentContractStatus } from "@/core/interfaces/Students.interface";
import { Validators } from "@/core/utils";

export class UpdateStudentDto {
    private constructor(
        public readonly identificationCard?: string,
        public readonly fullName?: string,
        public readonly phoneNumber?: string,
        public readonly email?: string,
        public readonly startDate?: Date,
        public readonly dateOfBirth?: Date,
        public readonly nationality?: string,
        public readonly certificateType?: CertificateType,

        public readonly contractStatus?: StudentContractStatus,
        public readonly isGraduated?: boolean,
    ) {}

    public get value() {
        const returnObject: { [key: string]: any } = {};

        if (this.identificationCard) returnObject.st_identification_card = this.identificationCard;
        if (this.fullName) returnObject.st_full_name = this.fullName;
        if (this.phoneNumber) returnObject.st_phone_number = this.phoneNumber;
        if (this.email) returnObject.st_email = this.email;
        if (this.startDate) returnObject.st_start_date = this.startDate;
        if (this.dateOfBirth) returnObject.st_date_of_birth = this.dateOfBirth;
        if (this.nationality) returnObject.st_nationality = this.nationality;
        if (this.certificateType) returnObject.st_certificate_type = this.certificateType;

        if (this.contractStatus) returnObject.st_contract_status = this.contractStatus;
        if (this.isGraduated !== undefined) returnObject.st_is_graduated = this.isGraduated;

        return returnObject;
    }

    public static create(object: { [key: string]: any }): [string?, UpdateStudentDto?] {
        const {
            identificationCard,
            fullName,
            phoneNumber,
            email,
            startDate,
            dateOfBirth,
            nationality,
            certificateType,
            contractStatus,
            isGraduated,
        } = object;

        if (
            !identificationCard &&
            !fullName &&
            !phoneNumber &&
            !email &&
            !startDate &&
            !dateOfBirth &&
            !nationality &&
            !certificateType &&
            !contractStatus &&
            isGraduated === undefined
        )
            return ["No data provided to update"];

        if (identificationCard && identificationCard.length !== 10) return ["Invalid identificationCard"];
        if (phoneNumber && phoneNumber.length !== 10) return ["Invalid phoneNumber"];

        if (identificationCard && !Validators.isIdentificationCard(identificationCard)) return ["Invalid identificationCard"];
        if (phoneNumber && !Validators.isPhoneNumber(phoneNumber)) return ["Invalid phoneNumber"];

        if (startDate && !Validators.isDate(startDate)) return ["Invalid startDate"];
        if (dateOfBirth && !Validators.isDate(dateOfBirth)) return ["Invalid dateOfBirth"];

        return [
            undefined,
            new UpdateStudentDto(
                identificationCard,
                fullName,
                phoneNumber,
                email,
                startDate,
                dateOfBirth,
                nationality,
                certificateType,
                contractStatus,
                isGraduated,
            ),
        ];
    }
}
