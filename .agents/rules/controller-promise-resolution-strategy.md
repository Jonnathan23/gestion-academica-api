---
trigger: manual
---

Controllers MUST NOT use `async/await` for executing Use Cases. You MUST resolve the Use Case promise using `.then()` and `.catch()` to ensure strict typing and proper middleware error delegation.

**Blueprint:**

```typescript
public methodName = (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract and validate DTOs here (if applicable)

    // 2. Instantiate Use Case
    const useCaseInstance = new UseCaseName(this.repositoryName);

    // 3. Execute and resolve via then/catch
    useCaseInstance
        .execute(dto) // pass DTO if required
        .then((result) => {
            const successMessage = "Action completed successfully";
            SuccessResponse.ok<ReturnType[]>(res, successMessage, result); // Use appropriate HTTP status method
        })
        .catch((error) => {
            next(error); // Delegate ALL errors to the global error handler
        });
};
```
