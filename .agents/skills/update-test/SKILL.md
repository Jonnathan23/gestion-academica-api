---
name: update-test
description: Update existing integration tests for the backend application based on new requirements, route changes, or RBAC modifications.
---

# Update-Test Skill for Antigravity

**ROLE:** Act as a Senior QA Automation Engineer and Backend Developer expert in Node.js, `bun:test`, Supertest, and Clean Architecture.

## Execution & Environment (CRITICAL)

When verifying updated tests, the execution environment must be explicitly defined using the correct package.json script:

- **Strict Command:** Use only `bun run test:local <file-path>` for execution.
- **Reasoning:** This command guarantees the tests route to the local Dockerized test database (e.g., port 5434) by injecting the proper environment file. Do NOT execute raw `bun test`.

**Execution Example:**

```bash
bun run test:local src/app/admin-desk/students/presentation/__tests__/students.router.integration.test.ts
```

## 1. Update Context Requirement (CRITICAL)

To effectively update tests, you MUST be provided with two key pieces of information from the user:

- The existing test code: You must analyze the current state of the tests to maintain the existing structure and only modify what is necessary.
- The updated feature documentation: The new rules, endpoint routes, RBAC permissions, or payload structures that require the tests to be updated.

## 2. Architecture: Success Responses

All successful HTTP responses are formatted by the SuccessResponse utility class. Ensure updated tests still assert against this exact structure:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": { ... }
}
```

**Assertion Example (`bun:test`):**

```typescript
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.message).toBe("Expected message");
```

### 3. Architecture: Error Handling (CRITICAL)

All errors in the domain or controllers are thrown using the CustomError class. These are intercepted by a globalErrorHandler middleware, which ALWAYS returns errors inside an array of objects.

```json
{
    "errors": [{ "message": "Missing email" }]
}
```

**Assertion Example (`bun:test`):**
DO NOT use response.body.error. You MUST use response.body.errors[0].message:

```typescript
expect(response.status).toBe(400);
expect(response.body.errors[0].message).toContain("Missing email");
```

### 4. RBAC & Security Testing (Claims-Based)

Endpoints are protected by RoleMiddleware.requirePermissions([systemPermissions...]). The system uses a Role-Based Access Control mapping with four primary roles: ADMIN, ADVISOR, ACADEMIC_DIRECTOR, and TEACHER.

**Update Strategy:** If the documentation indicates a change in required permissions, you MUST update the authorization describe block. Ensure the test injects a user with a role that now lacks permission to verify the 403 Forbidden response.

**Assertion Example (`bun:test`):**

```typescript
describe("Authorization & Permissions (RBAC)", () => {
    let unauthorizedToken: string;

    beforeAll(async () => {
        const unauthorizedUser = await User.create({
            us_full_name: "Unauthorized RBAC Tester",
            us_email: "unauthorized.rbac@test.com",
            us_password_hash: "MockHash123!",
            us_role: userRoles.TEACHER, // Adjust this role based on the new documentation
            us_is_active: true,
        });

        unauthorizedToken = (await JwtAdapter.generateToken({
            id: unauthorizedUser.us_id,
            email: unauthorizedUser.us_email,
            role: unauthorizedUser.us_role,
        })) as string;
    });

    test("[403] Should deny access if user lacks the newly required permission", async () => {
        const response = await request(app).post("/api/resource").set("Authorization", `Bearer ${unauthorizedToken}`).send(validPayload);

        expect(response.status).toBe(403);
        expect(response.body.errors[0].message).toContain("Access denied");
    });
});
```

### 5. Testing Best Practices

- Preserve existing describe blocks unless the domain structure has fundamentally changed.
- Prefix test descriptions with the expected HTTP status code.
- Ensure the Arrange-Act-Assert pattern remains clear after your updates.

### 6. Dynamic Endpoint Documentation Context (CRITICAL FOR ROUTING)

As a feature-specific testing agent, your scope is strictly limited to updating the provided tests based on the new documentation context.

**Your Execution Rules:**

- Analyze the Delta: Compare the provided existing test code with the new documentation. Identify exactly what changed (e.g., HTTP method changed from PUT to PATCH, new required fields, different base route).
- Preserve Valid Tests: Do not delete existing tests that are still valid under the new rules. Only modify, add, or remove tests that are directly affected by the changes in the documentation.
- Extract Exact Routes: Rely entirely on the provided document to accurately reconstruct your Supertest calls.
