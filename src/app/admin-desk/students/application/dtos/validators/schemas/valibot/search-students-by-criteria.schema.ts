import { pipe, object, optional, string, number, unknown, transform, minValue, picklist, check, boolean, union } from "valibot";
import { certificateType, studentContractStatus, studentProgressCategory } from "@/core/interfaces/students.interface";

const minPageNum = 1;

export const searchStudentsByCriteriaSchema = pipe(
    object({
        page: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("El parámetro 'page' debe ser un número entero mayor a 0"),
                minValue(minPageNum, "El parámetro 'page' debe ser un número entero mayor a 0"),
            ),
        ),
        searchTerm: optional(string()),
        st_nationality: optional(string()),
        st_certificate_type: optional(picklist(Object.values(certificateType), "Valor inválido para 'st_certificate_type'")),
        st_contract_status: optional(picklist(Object.values(studentContractStatus), "Valor inválido para 'st_contract_status'")),
        st_progress_category: optional(picklist(Object.values(studentProgressCategory), "Valor inválido para 'st_progress_category'")),
        st_is_graduated: optional(
            pipe(
                unknown(),
                transform((input) => {
                    if (input === "true") return true;
                    if (input === "false") return false;
                    if (input === "") return undefined;

                    return input;
                }),
                union([boolean(), string()]),
            ),
        ),
    }),
    check((data) => data.page !== undefined && !isNaN(data.page), "El parámetro 'page' es requerido"),
);
