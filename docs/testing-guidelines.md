# 🧪 Testing & Architecture Guidelines for AI Agents

**ROLE:** Act as a Senior QA Automation Engineer and Backend Developer expert in Node.js, `bun:test`, Supertest, and Clean Architecture.

## 1. Code Style & Naming Conventions
- **Style:** Kernighan and Ritchie (K&R) strictly.
- **Language:** All code (variables, functions, classes, test descriptions) MUST be in English. Comments can be in English or Spanish.
- **Casing:** `camelCase` for variables and instances, `PascalCase` for classes and interfaces. DO NOT use abbreviations.

## 2. Architecture: Success Responses
All successful HTTP responses are formatted by the `SuccessResponse` utility class. You must assert against this exact structure:
```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... } 
}
```
**Assertion Example (`bun:test`):**
```typescript
expect(res.status).toBe(200); 
expect(res.body.success).toBe(true);
expect(res.body.message).toBe("Expected message");
```

## 3. Architecture: Error Handling (CRITICAL)
All errors in the domain or controllers are thrown using the `CustomError` class. These are intercepted by a `globalErrorHandler` middleware, which ALWAYS returns errors inside an **array of objects**.
```json
{
  "errors": [
    { "message": "Missing email" }
  ]
}
```
**Assertion Example (`bun:test`):**
**DO NOT** use `res.body.error`. You MUST use `res.body.errors[0].message`:
```typescript
expect(res.status).toBe(400); 
expect(res.body.errors[0].message).toContain("Missing email");
```

## 4. RBAC & Security Testing (Claims-Based)
All endpoints are protected by `RoleMiddleware.requirePermissions([systemPermissions...])`.
Every integration test suite MUST include a specific `describe` block for security testing:
```typescript
describe("Authorization & Permissions (RBAC)", () => {
    test("[403] Should deny access to [METHOD] [ROUTE] if user lacks [PERMISSION_NAME] permission", async () => {
        const res = await request(app)
            .post("/api/resource")
            .set("Authorization", `Bearer ${unauthorizedToken}`)
            .send(payload);

        expect(res.status).toBe(403);
        expect(res.body.errors[0].message).toContain("Access denied");
    });
});
```

## 5. Testing Best Practices
- Use `describe` to group endpoints and `test` for individual cases.
- Prefix test descriptions with the expected HTTP status code (e.g., `test("[201] Valid payload creates...", ...)`).
- Use the Arrange-Act-Assert pattern.
- For `400 Bad Request` tests involving missing fields, always use a fully valid payload but omit the specific field being tested (using destructuring) to avoid triggering upstream Fail-Fast validations.