//import { ZodValidatorFactory } from "@/core/utils/adapters/validators/zod/zod-validator-factory.adapter";
import { ValibotValidatorFactory } from "@/core/utils/adapters/validators/valibot/valibot-validator-factory.adapter";
import type { ValidatorFactory } from "@/core/utils/adapters/validators/interfaces/validator-factory.interface";

//const zodValidator = new ZodValidatorFactory();
const valibotValidator = new ValibotValidatorFactory();

//const validatorFactory: ValidatorFactory = zodValidator;
const validatorFactory: ValidatorFactory = valibotValidator;

export const createValidator = validatorFactory.createValidator.bind(validatorFactory);
