import type { ZodSchema } from "zod";
import { CustomError } from "@/core/error/customError.error";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class ZodValidatorAdapter<TExpectedEntity> implements EntityValidator<TExpectedEntity> {
    private readonly schema: ZodSchema<TExpectedEntity>;

    public constructor(schema: ZodSchema<TExpectedEntity>) {
        this.schema = schema;
    }

    public validate(rawData: unknown): TExpectedEntity {
        const validationResult = this.schema.safeParse(rawData);

        if (!validationResult.success) {
            const formattedErrors = validationResult.error.issues.map((issue) => issue.message).join(", ");

            throw CustomError.badRequest(formattedErrors);
        }

        return validationResult.data;
    }
}
