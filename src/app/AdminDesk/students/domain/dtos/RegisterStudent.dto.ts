import { Validators } from "@/core/utils";

export class RegisterStudentDto {
    private constructor(
        public readonly identificationCard: string,
        public readonly fullName: string,
        public readonly phoneNumber: string,
        public readonly startDate: Date
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterStudentDto?] {
        const { identificationCard, fullName, phoneNumber, startDate } = object;

        if (!identificationCard) return ['Missing identificationCard'];
        if (!fullName) return ['Missing fullName'];
        if (!phoneNumber) return ['Missing phoneNumber'];
        if (!startDate) return ['Missing startDate'];


        if (identificationCard.length !== 10) return ['Invalid identificationCard'];
        if (phoneNumber.length !== 10) return ['Invalid phoneNumber'];
        if(fullName.length < 3) return ['Invalid fullName'];
        if (!Validators.isIdentificationCard(identificationCard)) return ['Invalid identificationCard'];
        if (!Validators.isPhoneNumber(phoneNumber)) return ['Invalid phoneNumber'];

        const parsedDate = new Date(startDate);
        if (isNaN(parsedDate.getTime())) return ['Invalid startDate'];

        return [undefined, new RegisterStudentDto(
            identificationCard,
            fullName,
            phoneNumber,
            parsedDate
        )];
    }
}
