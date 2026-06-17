import { describe, test, expect, beforeAll, afterAll, mock } from "bun:test";
import cron from "node-cron";

import { CalculateRetentionAlertsWorker } from "@/app/class-track/feats/retention-alerts/presentation/workers/calculateRetentionAlerts.worker";
import { environmentVariables } from "@/core/config/envs";
import { DatabaseConnection } from "@/data/config/dbPostgresql";
import { Student } from "@/data/models/admin-desk";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";
import RetentionAlert from "@/data/models/class-track/RetentionAlert.model";
import { certificateType } from "@/data/models/admin-desk/Student.model";
import { attendanceSessionStatus } from "@/app/class-track/feats/attendance/domain/interfaces/Attendance.interface";

// ------------------------------------------------------------------ //
// Database connection
// ------------------------------------------------------------------ //
const testDatabase = new DatabaseConnection({
    databaseUrl: environmentVariables.databaseUrl,
    enableLogging: false,
    forceSynchronization: true,
});

// 1. Mock the node-cron module completely
mock.module("node-cron", () => {
    return {
        default: {
            schedule: mock((cronExpression: string, callback: () => void) => {
                // Store the callback globally to call it synchronously
                // @ts-ignore
                globalThis.__CALCULATE_RETENTION_CRON_CALLBACK__ = callback;
                return { start: mock(), stop: mock() };
            }),
        },
    };
});

describe("Worker: CalculateRetentionAlertsWorker", () => {
    let targetStudentId: string;
    let otherStudentId: string;

    beforeAll(async () => {
        await testDatabase.connect();

        // 2. Seed the database with target data
        // Student A: Absent for > 10 days
        const studentA = await Student.create({
            st_identification_card: "1733333333",
            st_full_name: "Student Worker Target A",
            st_phone_number: "0977777777",
            st_email: "studentA.worker@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Toefl,
            st_start_date: new Date("2024-01-01"),
            st_contract_status: "ACTIVE",
            st_progress_category: "MODERATE",
            st_is_graduated: false,
        });
        targetStudentId = studentA.st_id;

        // Create an attendance session 12 days ago for Student A
        const date12DaysAgo = new Date();
        date12DaysAgo.setDate(date12DaysAgo.getDate() - 12);

        await AttendanceSession.create({
            at_se_student_id: targetStudentId,
            at_se_session_date: date12DaysAgo,
            at_se_entry_time: date12DaysAgo,
            at_se_exit_time: new Date(date12DaysAgo.getTime() + 60 * 60 * 1000),
            at_se_total_minutes: 60,
            at_se_status: attendanceSessionStatus.Approved,
        });

        // Student B: Present recently (should not be alerted)
        const studentB = await Student.create({
            st_identification_card: "1744444444",
            st_full_name: "Student Worker Target B",
            st_phone_number: "0966666666",
            st_email: "studentB.worker@test.com",
            st_date_of_birth: new Date("2000-01-01"),
            st_nationality: "Ecuadorian",
            st_certificate_type: certificateType.Toefl,
            st_start_date: new Date("2024-01-01"),
            st_contract_status: "ACTIVE",
            st_progress_category: "MODERATE",
            st_is_graduated: false,
        });
        otherStudentId = studentB.st_id;

        const date2DaysAgo = new Date();
        date2DaysAgo.setDate(date2DaysAgo.getDate() - 2);

        await AttendanceSession.create({
            at_se_student_id: otherStudentId,
            at_se_session_date: date2DaysAgo,
            at_se_entry_time: date2DaysAgo,
            at_se_exit_time: new Date(date2DaysAgo.getTime() + 60 * 60 * 1000),
            at_se_total_minutes: 60,
            at_se_status: attendanceSessionStatus.Approved,
        });

        // 3. Initialize the worker (this triggers the mocked cron.schedule)
        CalculateRetentionAlertsWorker.start();
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    test("[Integration] Should correctly identify and create retention alerts for absent students in the database", async () => {
        // 4. Act: Manually trigger the captured cron callback
        // @ts-ignore
        if (typeof globalThis.__CALCULATE_RETENTION_CRON_CALLBACK__ === "function") {
            // @ts-ignore
            const callback = globalThis.__CALCULATE_RETENTION_CRON_CALLBACK__;
            // The callback doesn't return a promise, so we just call it and wait a bit for async operations to complete
            callback();
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for the async UseCase to finish
        } else {
            throw new Error("Cron callback was not registered.");
        }

        // 5. Assert: Verify the database state mutated correctly

        // Assert Student A was alerted
        const alertA = await RetentionAlert.findOne({
            where: { re_al_student_id: targetStudentId },
            raw: true,
        });

        expect(alertA).not.toBeNull();
        expect(alertA?.re_al_status).toBe("PENDING");
        // Check days absent is at least 11 or 12
        expect(alertA?.re_al_days_absent).toBeGreaterThanOrEqual(11);

        // Assert Student B was NOT alerted
        const alertB = await RetentionAlert.findOne({
            where: { re_al_student_id: otherStudentId },
            raw: true,
        });

        expect(alertB).toBeNull();
    });
});
