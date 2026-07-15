import { CustomError } from "@/core/error/customError.error";

interface PickFieldsProps<T extends object, K extends keyof T> {
    objectToFilter: T;
    fieldsToKeep: readonly K[];
}

/**
 * @description Recibe un objeto y una lista de llaves, devolviendo un nuevo objeto
 * que solo contiene las propiedades especificadas.
 */
export function pickFields<T extends object, K extends keyof T>({ objectToFilter, fieldsToKeep }: PickFieldsProps<T, K>): Pick<T, K> {
    if (!objectToFilter || Object.keys(objectToFilter).length === 0) {
        throw CustomError.internalServer("El objeto a filtrar no puede estar vacío");
    }

    if (!fieldsToKeep || fieldsToKeep.length === 0) {
        throw CustomError.internalServer("Debe especificar al menos un campo a mantener");
    }

    const result = {} as Pick<T, K>;

    fieldsToKeep.forEach((field) => {
        if (field in objectToFilter) {
            result[field] = objectToFilter[field];
        }
    });

    return result;
}
