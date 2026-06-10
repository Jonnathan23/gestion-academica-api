---
name: create-worker-test
description: Create integration tests for backend background workers (cron jobs)
---

# Testing Guidelines for Background Workers (Cron Jobs)

**ROLE:** Act as a Senior QA Automation Engineer and Backend Developer expert in Node.js, `bun:test`, Sequelize, and Clean Architecture.

## 1. Execution & Environment (CRITICAL)

Always use the local testing script to ensure the `.env.test.local` environment is loaded and the test database is targeted:

- **Command:** `bun run test:local <file-path>`

## 2. Testing Strategy: No Supertest, Direct Database Assertions

Workers do not expose HTTP endpoints. You MUST NOT use `supertest`.
The integration test for a worker focuses on:

1. **Arrange (Seed):** Injecting specific target data into the test database (e.g., expired sessions, overdue payments).
2. **Act (Bypass Cron):** Mocking `node-cron` to instantly trigger the scheduled callback.
3. **Assert (Verify State):** Querying the database directly via Sequelize models to ensure the records were correctly mutated by the worker's underlying Use Case.

## 3. Mocking `node-cron` in `bun:test`

You must use `bun:test`'s mocking capabilities to capture the callback passed to `cron.schedule` so it can be executed synchronously during the test.

**Blueprint for Mocking & Execution:**

```typescript
import { describe, test, expect, beforeAll, afterAll, mock } from "bun:test";
import cron from "node-cron";
import { CloseOrphanSessionsWorker } from "./closeOrphanSessions.worker";
import { AttendanceSession } from "@/app/class-track/feats/attendance/domain/entities/AttendanceSession"; // Adjust to your actual DB Model

// 1. Mock the node-cron module completely
mock.module("node-cron", () => {
    return {
        default: {
            schedule: mock((cronExpression: string, callback: () => void) => {
                // We store the callback globally or simply return it so we can call it later
                globalThis.__CRON_CALLBACK__ = callback;
                return { start: mock(), stop: mock() };
            }),
        },
    };
});

describe("Worker: CloseOrphanSessionsWorker", () => {
    beforeAll(async () => {
        // 2. Seed the database with target data (e.g., a session older than 24 hours)
        const pastDate = new Date();
        pastDate.setHours(pastDate.getHours() - 25);

        await AttendanceSession.create({
            at_se_id: "test-orphan-id",
            at_se_student_id: "valid-student-id",
            at_se_status: "IN_PROGRESS",
            at_se_entry_time: pastDate,
        });

        // 3. Initialize the worker (this will trigger the mocked cron.schedule)
        CloseOrphanSessionsWorker.start();
    });

    test("[Integration] Should correctly identify and close orphan sessions in the database", async () => {
        // 4. Act: Manually trigger the captured cron callback
        if (typeof globalThis.__CRON_CALLBACK__ === "function") {
            await globalThis.__CRON_CALLBACK__();
        } else {
            throw new Error("Cron callback was not registered.");
        }

        // 5. Assert: Verify the database state mutated correctly
        const updatedSession = await AttendanceSession.findOne({
            where: { at_se_id: "test-orphan-id" },
            raw: true,
        });

        expect(updatedSession).not.toBeNull();
        expect(updatedSession?.at_se_status).toBe("CLOSED"); // Assuming CLOSED is the resolution status
    });
});
```

## 4. Strict Testing Rules for Workers

Database Cleanup: Ensure records created in beforeAll do not interfere with other tests. Use isolated IDs or clean up in afterAll.

Asynchronous Resolution: The cron callback usually executes an async Use Case. Ensure you await the callback if it returns a promise, or add a slight delay if it runs entirely in the background without returning a promise, to prevent false positives in assertions.

No any Types: Maintain strict typing when asserting database results.
