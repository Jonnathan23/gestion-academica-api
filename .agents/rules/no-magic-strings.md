---
trigger: always_on
---

The use of raw, hardcoded "magic strings" for domain statuses, categories, types, or roles is STRICTLY FORBIDDEN. You must NEVER type `status: string` when a predefined domain constant exists, and you must NEVER pass raw strings like `"IN_PROGRESS"` as arguments.

1. **Definition:** Domain values must be defined as a constant object using `as const`, followed by a derived TypeScript type extracting its values.
2. **Interfaces & Methods:** All methods, interfaces, and parameters MUST require the strict derived type, never a primitive `string`.
3. **Execution:** When passing values or comparing, you MUST use the constant object properties.

**Blueprint (Definition):**

```typescript
export const attendanceSessionStatus = {
    InProgress: "IN_PROGRESS",
    PendingApproval: "PENDING_APPROVAL",
    Approved: "APPROVED",
} as const;

// Correct extraction of values, NOT keys.
export type AttendanceSessionStatus = (typeof attendanceSessionStatus)[keyof typeof attendanceSessionStatus];
```

**Blueprint (Usage & Enforcement):**

```typescript
// BAD: public async getActiveSessions(status: string)
// GOOD: Require the strict type
public async getActiveSessions(status: AttendanceSessionStatus): Promise<StudentInClassProjection[]> { ... }

// BAD: repository.getActiveSessions("IN_PROGRESS");
// GOOD: Use the constant object
const sessions = await this.attendanceRepository.getActiveSessions(attendanceSessionStatus.InProgress);
```
