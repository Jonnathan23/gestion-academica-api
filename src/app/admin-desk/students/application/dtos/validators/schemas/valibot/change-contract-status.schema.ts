import { pipe, object, optional, picklist, check } from "valibot";
import { studentContractStatus } from "@/core/interfaces/students.interface";

export const changeContractStatusSchema = pipe(
    object({
        contractStatus: optional(picklist(Object.values(studentContractStatus), "Invalid contractStatus")),
    }),
    check((data) => data.contractStatus !== undefined, "Missing contractStatus"),
);
