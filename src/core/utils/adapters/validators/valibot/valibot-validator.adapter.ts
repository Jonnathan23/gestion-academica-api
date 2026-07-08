import { safeParse, type GenericSchema } from "valibot";
import { CustomError } from "@/core/error/customError.error";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class ValibotValidatorAdapter<TExpectedEntity> implements EntityValidator<TExpectedEntity> {
    private readonly schema: GenericSchema;

    public constructor(schema: GenericSchema) {
        this.schema = schema;
    }

    public validate(rawData: unknown): TExpectedEntity {
        const validationResult = safeParse(this.schema, rawData);

        if (!validationResult.success) {
            const formattedErrors = validationResult.issues.map((issue) => issue.message).join(", ");

            throw CustomError.badRequest(formattedErrors);
        }

        return validationResult.output as TExpectedEntity;
    }
}
