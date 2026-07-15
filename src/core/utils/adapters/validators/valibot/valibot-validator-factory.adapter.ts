import type { GenericSchema } from "valibot";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { ValidatorFactory } from "@/core/utils/adapters/validators/interfaces/validator-factory.interface";
import { ValibotValidatorAdapter } from "@/core/utils/adapters/validators/valibot/valibot-validator.adapter";

export class ValibotValidatorFactory implements ValidatorFactory {
    public createValidator<TExpectedData>(schema: unknown): EntityValidator<TExpectedData> {
        const valibotSchema = schema as GenericSchema;

        return new ValibotValidatorAdapter<TExpectedData>(valibotSchema);
    }
}
