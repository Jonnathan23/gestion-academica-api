import { pipe, object, optional, picklist, check, string, minLength, custom, boolean, unknown, transform } from "valibot";
import { certificateType, studentContractStatus } from "@/core/interfaces/students.interface";
import { Validators } from "@/core/utils/validators";

const idLength = 10;
const phoneLength = 10;

export const updateStudentSchema = pipe(
    object({
        identificationCard: optional(
            pipe(
                string("Invalid identificationCard"),
                minLength(idLength, "Invalid identificationCard"),
                custom((val) => (val as string).length === idLength, "Invalid identificationCard"),
                custom((val) => Validators.isIdentificationCard(val as string), "Invalid identificationCard"),
            ),
        ),
        fullName: optional(string()),
        phoneNumber: optional(
            pipe(
                string("Invalid phoneNumber"),
                minLength(phoneLength, "Invalid phoneNumber"),
                custom((val) => (val as string).length === phoneLength, "Invalid phoneNumber"),
                custom((val) => Validators.isPhoneNumber(val as string), "Invalid phoneNumber"),
            ),
        ),
        email: optional(
            pipe(
                string("Invalid email"),
                custom((val) => Validators.isEmail(val as string), "Invalid email"),
            ),
        ),
        startDate: optional(
            pipe(
                string("Invalid startDate"),
                custom((val) => Validators.isDate(val as string), "Invalid startDate"),
            ),
        ),
        dateOfBirth: optional(
            pipe(
                string("Invalid dateOfBirth"),
                custom((val) => Validators.isDate(val as string), "Invalid dateOfBirth"),
            ),
        ),
        nationality: optional(string()),
        certificateType: optional(picklist(Object.values(certificateType), "Invalid certificateType")),
        contractStatus: optional(picklist(Object.values(studentContractStatus), "Invalid contractStatus")),
        isGraduated: optional(
            pipe(
                unknown(),
                transform((input) => {
                    if (input === "true") return true;
                    if (input === "false") return false;

                    return input;
                }),
                boolean(),
            ),
        ),
    }),
    check((data) => {
        return (
            data.identificationCard !== undefined ||
            data.fullName !== undefined ||
            data.phoneNumber !== undefined ||
            data.email !== undefined ||
            data.startDate !== undefined ||
            data.dateOfBirth !== undefined ||
            data.nationality !== undefined ||
            data.certificateType !== undefined ||
            data.contractStatus !== undefined ||
            data.isGraduated !== undefined
        );
    }, "No data provided to update"),
);
