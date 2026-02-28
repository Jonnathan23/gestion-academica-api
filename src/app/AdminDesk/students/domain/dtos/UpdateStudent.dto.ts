import type { StudentContractStatus } from "@/app/AdminDesk/students/domain/interfaces/Students.interface";
import { Validators } from "@/core/utils";

export class UpdateStudentDto {
    private constructor(
        public readonly identificationCard?: string,
        public readonly fullName?: string,
        public readonly phoneNumber?: string,
        public readonly startDate?: Date,
        public readonly contractStatus?: StudentContractStatus,
        public readonly isGraduated?: boolean
    ) { }

    get value() {
        const returnObject: { [key: string]: any } = {};
        if (this.identificationCard) returnObject.st_identification_card = this.identificationCard;
        if (this.fullName) returnObject.st_full_name = this.fullName;
        if (this.phoneNumber) returnObject.st_phone_number = this.phoneNumber;
        if (this.startDate) returnObject.st_start_date = this.startDate;
        if (this.contractStatus) returnObject.st_contract_status = this.contractStatus;
        if (this.isGraduated !== undefined) returnObject.st_is_graduated = this.isGraduated;

        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateStudentDto?] {
        const { identificationCard, fullName, phoneNumber, startDate, contractStatus, isGraduated } = object;

        if (!identificationCard && !fullName && !phoneNumber && !startDate) return ['No data provided to update'];

        if (identificationCard && identificationCard.length !== 10) return ['Invalid identificationCard'];
        if (phoneNumber && phoneNumber.length !== 10) return ['Invalid phoneNumber'];

        if (identificationCard && !Validators.isIdentificationCard(identificationCard)) return ['Invalid identificationCard'];
        if (phoneNumber && !Validators.isPhoneNumber(phoneNumber)) return ['Invalid phoneNumber'];

        const parsedDate = startDate ? new Date(startDate) : undefined;
        if (parsedDate && isNaN(parsedDate.getTime())) return ['Invalid startDate'];

        return [undefined, new UpdateStudentDto(
            identificationCard,
            fullName,
            phoneNumber,
            parsedDate,
            contractStatus,
            isGraduated
        )];
    }
}
