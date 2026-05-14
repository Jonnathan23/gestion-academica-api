
interface PickFieldsProps<T extends object, K extends keyof T> {
    objectToFilter: T;
    fieldsToKeep: readonly K[];
}

/**
 * Recibe un objeto y una lista de llaves, devolviendo un nuevo objeto
 * que solo contiene las propiedades especificadas.
 */
export function pickFields<T extends object, K extends keyof T>({ objectToFilter, fieldsToKeep }: PickFieldsProps<T, K>): Pick<T, K> {
    //TODO: validar y mapear los datos a recibir del modelo, no puede enviar objetos vacios
    const result = {} as Pick<T, K>;
    fieldsToKeep.forEach((field) => {
        if (field in objectToFilter) {
            result[field] = objectToFilter[field];
        }
    });
    return result;
}