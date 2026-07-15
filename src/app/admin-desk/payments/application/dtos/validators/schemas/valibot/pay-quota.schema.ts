import { pipe, object, optional, string, uuid, number, minValue, check, unknown, transform, picklist } from "valibot";
import { paymentMethod } from "@/app/admin-desk/payments/domain/interfaces/payment-method.interface";

const minAmountPaid = 0.01;

export const payQuotaSchema = pipe(
    object({
        quotaId: optional(pipe(string("Invalid or missing quotaId"), uuid("Invalid or missing quotaId"))),
        amountPaid: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("amountPaid must be greater than 0"),
                minValue(minAmountPaid, "amountPaid must be greater than 0"),
            ),
        ),
        paymentMethod: optional(
            picklist(Object.values(paymentMethod), "Invalid paymentMethod. Must be CASH, TRANSFER, CreditCard or MIXED"),
        ),
    }),
    check((data) => data.quotaId !== undefined, "Invalid or missing quotaId"),
    check((data) => data.amountPaid !== undefined, "amountPaid must be greater than 0"),
    check((data) => data.paymentMethod !== undefined, "Invalid paymentMethod. Must be CASH, TRANSFER, CreditCard or MIXED"),
);
