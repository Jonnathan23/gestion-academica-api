import { describe, test, expect } from "bun:test";
import { parse, safeParse } from "valibot";

import { registerLessonLogSchema } from "@/app/class-track/feats/attendance/application/dtos/validators/schemas/valibot/register-lesson-log.schema";
import { getCountAlertsSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/get-count-alerts.schema";
import { getRetentionAlertsSchema } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/schemas/valibot/get-retention-alerts.schema";
import { retentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";

describe("Unit Tests: Valibot Schemas", () => {
    describe("registerLessonLogSchema", () => {
        test("Should pass with valid data", () => {
            const data = {
                attendanceSessionId: "session-123",
                lessonNumber: "1",
                notes: "Good",
                activeModule: "module-1",
            };
            const result = parse(registerLessonLogSchema, data);
            expect(result).toEqual(data);
        });

        test("Should fail if attendanceSessionId is missing", () => {
            const data = {
                lessonNumber: "1",
                notes: "Good",
                activeModule: "module-1",
            };
            expect(() => parse(registerLessonLogSchema, data)).toThrow("Missing attendanceSessionId");
        });

        test("Should fail if lessonNumber is missing", () => {
            const data = {
                attendanceSessionId: "session-123",
                notes: "Good",
                activeModule: "module-1",
            };
            expect(() => parse(registerLessonLogSchema, data)).toThrow("Missing lessonNumber");
        });

        test("Should fail if notes is missing", () => {
            const data = {
                attendanceSessionId: "session-123",
                lessonNumber: "1",
                activeModule: "module-1",
            };
            expect(() => parse(registerLessonLogSchema, data)).toThrow("Missing notes");
        });

        test("Should fail if activeModule is missing", () => {
            const data = {
                attendanceSessionId: "session-123",
                lessonNumber: "1",
                notes: "Good",
            };
            expect(() => parse(registerLessonLogSchema, data)).toThrow("Missing activeModule");
        });
    });

    describe("getRetentionAlertsSchema", () => {
        test("Should validate completely valid data", () => {
            const data = { page: 1, limit: 10, status: retentionAlertStatus.Pending, daysAbsent: 5, isJustified: "true" };
            const result = safeParse(getRetentionAlertsSchema, data);
            expect(result.success).toBe(true);
        });

        test("Should fail if page is missing", () => {
            const data = { limit: 10 };
            const result = safeParse(getRetentionAlertsSchema, data);
            expect(result.success).toBe(false);
        });

        test("Should fail if limit is invalid", () => {
            const data = { page: 1, limit: "invalid" };
            const result = safeParse(getRetentionAlertsSchema, data);
            expect(result.success).toBe(false);
        });

        test("Should fail if daysAbsent is invalid", () => {
            const data = { page: 1, daysAbsent: -1 };
            const result = safeParse(getRetentionAlertsSchema, data);
            expect(result.success).toBe(false);

            const data2 = { page: 1, daysAbsent: "abc" };
            const result2 = safeParse(getRetentionAlertsSchema, data2);
            expect(result2.success).toBe(false);
        });
    });

    describe("getCountAlertsSchema", () => {
        test("Should pass with valid status", () => {
            const data = { status: retentionAlertStatus.Pending };
            const result = parse(getCountAlertsSchema, data);
            expect(result).toEqual(data);
        });

        test("Should fail if status is missing", () => {
            const data = {};
            expect(() => parse(getCountAlertsSchema, data)).toThrow("status is required");
        });

        test("Should fail if status is invalid", () => {
            const data = { status: "INVALID_STATUS" };
            expect(() => parse(getCountAlertsSchema, data)).toThrow("Invalid status value");
        });
    });
});
