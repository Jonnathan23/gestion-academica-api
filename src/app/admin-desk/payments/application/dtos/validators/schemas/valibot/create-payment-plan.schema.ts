import { pipe, object, optional, string, uuid, number, minValue, boolean, check, unknown, transform, custom } from "valibot";

const minEnrollmentFee = 0;
const minTotalAmount = 0.01; // totalAmount > 0
const minNumberOfQuotas = 1;

export const createPaymentPlanSchema = pipe(
    object({
        studentId: optional(pipe(string("Invalid or missing studentId"), uuid("Invalid or missing studentId"))),
        sellerId: optional(pipe(string("Invalid or missing sellerId"), uuid("Invalid or missing sellerId"))),
        enrollmentFee: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("enrollmentFee must be 0 or greater"),
                minValue(minEnrollmentFee, "enrollmentFee must be 0 or greater"),
            ),
        ),
        totalAmount: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("totalAmount must be greater than 0"),
                minValue(minTotalAmount, "totalAmount must be greater than 0"),
            ),
        ),
        isSinglePayment: optional(boolean("Missing isSinglePayment boolean flag")),
        numberOfQuotas: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("numberOfQuotas must be at least 1"),
                minValue(minNumberOfQuotas, "numberOfQuotas must be at least 1"),
            ),
        ),
        firstQuotaDueDate: optional(
            pipe(
                string("Invalid firstQuotaDueDate format"),
                custom((val) => !isNaN(new Date(val as string).getTime()), "Invalid firstQuotaDueDate format"),
            ),
        ),
    }),
    check((data) => data.studentId !== undefined, "Invalid or missing studentId"),
    check((data) => data.sellerId !== undefined, "Invalid or missing sellerId"),
    check((data) => data.enrollmentFee !== undefined, "enrollmentFee must be 0 or greater"),
    check((data) => data.totalAmount !== undefined, "totalAmount must be greater than 0"),
    check((data) => data.isSinglePayment !== undefined, "Missing isSinglePayment boolean flag"),
    check((data) => data.firstQuotaDueDate !== undefined, "Missing firstQuotaDueDate"),
);
