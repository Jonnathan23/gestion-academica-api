---
name: create-new-dto
description: Creates a new DTO (Data Transfer Object) implementing the Valibot Dependency Injection (DI) validation pattern.
---

# Create New DTO Pattern

When creating a new DTO for a feature in this API, you MUST follow the Clean Architecture validation pattern. This pattern decouples the validation library (Valibot) from the core business logic using an adapter and dependency injection.

## 1. Directory Structure

Inside the `application/dtos` folder of the feature, maintain this exact structure:

```text
dtos/
├── create-{entity}.dto.ts
├── update-{entity}.dto.ts
├── interfaces/
│   ├── create-{entity}.interface.ts
│   ├── update-{entity}.interface.ts
│   └── {entity}-validators.interface.ts
└── validators/
    ├── di-validators.ts
    ├── validator.ts
    └── schemas/
        └── valibot/
            ├── create-{entity}.schema.ts
            └── update-{entity}.schema.ts
```

## 2. Implementation Steps

### Step 2.1: Define the interfaces

Create `create-{entity}.interface.ts` in `dtos/interfaces/`:

```typescript
export interface Create[Entity]Props {
    prop1: string;
    prop2: number;
}
```

### Step 2.2: Create the Valibot Schemas

Create the schemas in `dtos/validators/schemas/valibot/`.
**CRITICAL RULES**:

1. ALWAYS destructure imports from "valibot". DO NOT use `import * as v`.
2. Extract magic numbers into constants (e.g. `minLevel = 1`).
3. For custom missing key error messages, wrap the schema in a `pipe` with `check` at the end OR use `nonOptional(optional(...))`.

```typescript
import { pipe, object, optional, string, minLength, unknown, transform, number, minValue, check } from "valibot";

const minAge = 18;

export const create[Entity]Schema = pipe(
    object({
        prop1: optional(pipe(string("Missing prop1"), minLength(1, "Missing prop1"))),
        prop2: optional(
            pipe(
                unknown(),
                transform((input) => Number(input)),
                number("Missing prop2"),
                minValue(minAge, `Age must be at least ${minAge}`)
            )
        )
    }),
    check((data) => data.prop1 !== undefined, "Missing prop1"),
    check((data) => data.prop2 !== undefined, "Missing prop2")
);
```

### Step 2.3: Define the Validators Interface

Create `dtos/interfaces/{entity}-validators.interface.ts`:

```typescript
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { Create[Entity]Props } from "@/app/.../dtos/interfaces/create-{entity}.interface";

export interface [Entity]Validators {
    create[Entity]Validator: EntityValidator<Create[Entity]Props>;
}
```

### Step 2.4: Create the Validator Host Class

Create `dtos/validators/validator.ts`:

```typescript
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { [Entity]Validators } from "@/app/.../dtos/interfaces/{entity}-validators.interface";
import type { Create[Entity]Props } from "@/app/.../dtos/interfaces/create-{entity}.interface";

export class [Entity]ValidatorsImpl implements [Entity]Validators {
    public constructor(
        public readonly create[Entity]Validator: EntityValidator<Create[Entity]Props>
    ) {}
}
```

### Step 2.5: Assemble DI Validators

Create `dtos/validators/di-validators.ts` to export the singleton factory instance:

```typescript
import { createValidator } from "@/core/utils/adapters/validators/di-validators";
import { create[Entity]Schema } from "@/app/.../dtos/validators/schemas/valibot/create-{entity}.schema";
import { [Entity]ValidatorsImpl } from "@/app/.../dtos/validators/validator";
import type { Create[Entity]Props } from "@/app/.../dtos/interfaces/create-{entity}.interface";

const create[Entity]Validator = createValidator<Create[Entity]Props>(create[Entity]Schema);

export const [entity]Validators = new [Entity]ValidatorsImpl(create[Entity]Validator);
```

### Step 2.6: Create the DTO

Create `create-{entity}.dto.ts`.
**CRITICAL RULE**: Do not return an error tuple. Use the Fail-Fast approach where the validator throws a `CustomError` which is caught by the controller.

```typescript
import type { Create[Entity]Props } from "@/app/.../dtos/interfaces/create-{entity}.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class Create[Entity]Dto {
    private constructor(
        public readonly prop1: string,
        public readonly prop2: number
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<Create[Entity]Props>): Create[Entity]Dto {
        const validatedData = validator.validate(object);
        return new Create[Entity]Dto(validatedData.prop1, validatedData.prop2);
    }
}
```

### Step 2.7: Inject in Controller and Router

Update the Controller to receive `validators: [Entity]Validators` in its constructor, and use a `try/catch` to forward errors to `next(error)`.
Update the Router to inject `[entity]Validators` into the new controller instance.
