import type { ZodSchema, ZodTypeAny } from "zod";
import type z from "zod";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ValidatorFactory } from "@/core/utils/adapters/validators/interfaces/validator-factory.interface";
import { ZodValidatorAdapter } from "@/core/utils/adapters/validators/zod/zod-validator.adapter";

export type InferSchema<T extends ZodTypeAny> = z.infer<T>;

export class ZodValidatorFactory implements ValidatorFactory {
    public createValidator<TExpectedData>(schema: unknown): EntityValidator<TExpectedData> {
        const zodSchema = schema as ZodSchema<TExpectedData>;

        return new ZodValidatorAdapter<TExpectedData>(zodSchema);
    }
}
