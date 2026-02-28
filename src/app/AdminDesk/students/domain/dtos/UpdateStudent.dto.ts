import { Validators } from "@/core/utils";

export class UpdateStudentDto {
    private constructor(
        public readonly identificationCard?: string,
        public readonly fullName?: string,
        public readonly phoneNumber?: string,
        public readonly startDate?: Date
        //TODO: Agregar los demas campos
    ) { }

    get value() {
        const returnObject: { [key: string]: any } = {};
        if (this.identificationCard) returnObject.identificationCard = this.identificationCard;
        if (this.fullName) returnObject.fullName = this.fullName;
        if (this.phoneNumber) returnObject.phoneNumber = this.phoneNumber;
        if (this.startDate) returnObject.startDate = this.startDate;

        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateStudentDto?] {
        const { identificationCard, fullName, phoneNumber, startDate } = object;

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
            parsedDate
        )];
    }
}
