import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export interface ValidatorFactory {
    createValidator<TExpectedData>(schema: unknown): EntityValidator<TExpectedData>;
}
