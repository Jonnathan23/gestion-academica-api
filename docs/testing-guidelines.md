# 🧪 Testing & Architecture Guidelines for AI Agents

**ROLE:** Act as a Senior QA Automation Engineer and Backend Developer expert in Node.js, `bun:test`, Supertest, and Clean Architecture.

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
    "errors": [{ "message": "Missing email" }]
}
```

**Assertion Example (`bun:test`):**
**DO NOT** use `res.body.error`. You MUST use `res.body.errors[0].message`:

```typescript
expect(res.status).toBe(400);
expect(res.body.errors[0].message).toContain("Missing email");
```

## 4. RBAC & Security Testing (Claims-Based)

Endpoints are protected by `RoleMiddleware.requirePermissions([systemPermissions...])`.
The system uses a Role-Based Access Control mapping with four primary roles:

- `ADMIN`: Has full access (`systemPermissions` all values).
- `ADVISOR`: Can read/write Students, Contracts, and Payments. Can ONLY READ Modules.
- `ACADEMIC_DIRECTOR`: Can read/write ClassTrack. Can ONLY READ AdminDesk entities.
- `TEACHER`: Can read/write ClassTrack. Can ONLY READ Students.

**Testing Strategy:** Do NOT use login endpoints to generate test tokens. You MUST inject the test users directly into the database using Sequelize (`User.create`) inside a `beforeAll` block, and then generate the token using `JwtAdapter.generateToken`.

Every integration test suite MUST include a specific `describe` block for RBAC security testing. You must assert that a role without the required permission receives a `403 Forbidden`.

**Assertion Example (`bun:test`):**

```typescript
describe("Authorization & Permissions (RBAC)", () => {
    let unauthorizedToken: string;

    beforeAll(async () => {
        // 1. Inject an unauthorized user (e.g., TEACHER trying to write Contracts)
        const teacherUser = await User.create({
            us_full_name: "Teacher RBAC Tester",
            us_email: "teacher.rbac@test.com",
            us_password_hash: "MockHash123!",
            us_role: userRoles.TEACHER,
            us_is_active: true, // Ensure user is active for the AuthMiddleware
        });

        // 2. Generate Token
        unauthorizedToken = (await JwtAdapter.generateToken({
            id: teacherUser.us_id,
            email: teacherUser.us_email,
            role: teacherUser.us_role,
        })) as string;
    });

    test("[403] Should deny access to POST /api/resource if user lacks required permission", async () => {
        const res = await request(app).post("/api/resource").set("Authorization", `Bearer ${unauthorizedToken}`).send(validPayload);

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

## 6. Dynamic Endpoint Documentation Context (CRITICAL FOR ROUTING)

As a feature-specific testing agent, your scope is limited strictly to a single domain feature at a time. Before writing or updating any tests, you MUST be provided with the specific endpoint documentation context for the feature currently under test.

**Your Execution Rules:**

1. **Require Documentation:** DO NOT guess routes, payloads, or HTTP methods. You must wait for the user to provide the content of the specific feature's documentation (e.g., the contents of `docs\admin-desk\students\students-endpoint-structure.md`) before generating any code.
2. **Extract Exact Routes:** Rely entirely on the provided document to accurately construct your Supertest calls. If the doc says `/api/v1/students`, you must use exactly that.
3. **Strict Scope:** Only generate tests for the endpoints explicitly detailed in the provided documentation. Do not attempt to write tests for related modules or relationships unless their documentation is also explicitly provided in the same prompt.

**Example of Expected Workflow:**

**User Prompt:**

> "Write integration tests for the new update student endpoint. Here is the documentation context:
> `PUT /api/v1/students/:id`
> Requires ADVISOR role. Body expects `us_full_name`."

**Agent Action:**

```typescript
import { describe, test, expect, beforeAll } from "bun:test";
import request from "supertest";
import app from "../../src/app";
// ... other imports

describe("Students Feature - Update Endpoint", () => {
    test("[200] Valid payload updates the student correctly", async () => {
        // Reads exact route and payload from the provided context
        const res = await request(app)
            .put(`/api/v1/students/${studentId}`)
            .set("Authorization", `Bearer ${advisorToken}`)
            .send({ us_full_name: "Updated Name" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
```
