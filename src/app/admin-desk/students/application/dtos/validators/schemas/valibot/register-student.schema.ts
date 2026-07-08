import { pipe, object, optional, picklist, check, string, minLength, custom } from "valibot";
import { certificateType } from "@/core/interfaces/students.interface";
import { Validators } from "@/core/utils/validators";

const minNameLength = 3;

export const registerStudentSchema = pipe(
    object({
        identificationCard: optional(
            pipe(
                string("Missing identificationCard"),
                custom((val) => Validators.isIdentificationCard(val as string), "Invalid identificationCard"),
            ),
        ),
        fullName: optional(pipe(string("Missing fullName"), minLength(minNameLength, "Invalid fullName"))),
        phoneNumber: optional(
            pipe(
                string("Missing phoneNumber"),
                custom((val) => Validators.isPhoneNumber(val as string), "Invalid phoneNumber"),
            ),
        ),
        email: optional(
            pipe(
                string("Missing email"),
                custom((val) => Validators.isEmail(val as string), "Invalid email"),
            ),
        ),
        startDate: optional(
            pipe(
                string("Missing startDate"),
                custom((val) => !isNaN(new Date(val as string).getTime()), "Invalid startDate"),
            ),
        ),
        dateOfBirth: optional(
            pipe(
                string("Missing dateOfBirth"),
                custom((val) => {
                    const parsedBirthDate = new Date(val as string);

                    return !isNaN(parsedBirthDate.getTime()) && Validators.isMinValidateAge(parsedBirthDate);
                }, "Invalid dateOfBirth"),
            ),
        ),
        nationality: optional(string("Missing nationality")),
        certificateType: optional(picklist(Object.values(certificateType), "Invalid certificateType")),
    }),
    check((data) => data.identificationCard !== undefined, "Missing identificationCard"),
    check((data) => data.fullName !== undefined, "Missing fullName"),
    check((data) => data.phoneNumber !== undefined, "Missing phoneNumber"),
    check((data) => data.email !== undefined, "Missing email"),
    check((data) => data.startDate !== undefined, "Missing startDate"),
    check((data) => data.dateOfBirth !== undefined, "Missing dateOfBirth"),
    check((data) => data.nationality !== undefined, "Missing nationality"),
    check((data) => data.certificateType !== undefined, "Missing certificateType"),
);
