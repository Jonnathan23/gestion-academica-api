import { describe, test, expect, beforeAll, afterAll, mock } from "bun:test";
import { CloseOrphanSessionsWorker } from "@/app/class-track/feats/attendance/presentation/workers/closeOrphanSessions.worker";
import AttendanceSession from "@/data/models/class-track/AttendanceSession.model";
import { Student } from "@/data/models/admin-desk";
import { DatabaseConnection } from "@/data/config/dbPostgresql";
import { environmentVariables } from "@/core/config/envs";

// 1. Mock the node-cron module completely
mock.module("node-cron", () => {
    return {
        default: {
            schedule: mock((cronExpression: string, callback: () => void) => {
                // We store the callback globally or simply return it so we can call it later
                (globalThis as any).__CRON_CALLBACK__ = callback;
                return { start: mock(), stop: mock() };
            }),
        },
    };
});

describe("Worker: CloseOrphanSessionsWorker", () => {
    const testDatabase = new DatabaseConnection({
        databaseUrl: environmentVariables.databaseUrl,
        enableLogging: false,
        forceSynchronization: true, // DB is empty upon start
    });

    beforeAll(async () => {
        // Connect and sync database (wipes all tables)
        await testDatabase.connect();

        // Initialize the worker (triggers mocked cron.schedule)
        CloseOrphanSessionsWorker.start();
    });

    afterAll(async () => {
        await testDatabase.disconnect();
    });

    const triggerWorker = async () => {
        const callback = (globalThis as any).__CRON_CALLBACK__;
        if (typeof callback === "function") {
            callback();
        } else {
            throw new Error("Cron callback was not registered.");
        }
    };

    describe("Zero State Resilience", () => {
        test("[Integration] Should not crash when the database is completely empty", async () => {
            // Assert that there are zero sessions initially
            const count = await AttendanceSession.count();
            expect(count).toBe(0);

            // Execute the worker
            await triggerWorker();

            // Wait a small static delay since there are no records to poll for
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Verify it didn't throw and DB is still empty
            const newCount = await AttendanceSession.count();
            expect(newCount).toBe(0);
        });
    });

    describe("Data Scenarios", () => {
        let targetStudentId: string;
        let orphanSessionId: string;
        let recentSessionId: string;
        let resolvedSessionId: string;
        let boundarySafeSessionId: string; // 11h55m
        let boundaryOrphanSessionId: string; // 12h05m

        beforeAll(async () => {
            // Seed a student
            const student = await Student.create({
                st_identification_card: "3333333333",
                st_full_name: "Worker Edge Case Student",
                st_phone_number: "0999999999",
                st_email: "worker.edges@test.com",
                st_date_of_birth: new Date("2000-01-01"),
                st_nationality: "Ecuadorian",
                st_certificate_type: "TOEFL",
                st_start_date: new Date("2024-01-01"),
                st_contract_status: "ACTIVE",
                st_progress_category: "MODERATE",
                st_is_graduated: false,
            });
            targetStudentId = student.st_id;

            // 1. Basic Orphan session (13 hours ago)
            const past13h = new Date();
            past13h.setHours(past13h.getHours() - 13);
            const orphanSession = await AttendanceSession.create({
                at_se_student_id: targetStudentId,
                at_se_session_date: past13h,
                at_se_entry_time: past13h,
                at_se_status: "IN_PROGRESS",
            });
            orphanSessionId = orphanSession.at_se_id;

            // 2. Recent session (2 hours ago)
            const past2h = new Date();
            past2h.setHours(past2h.getHours() - 2);
            const recentSession = await AttendanceSession.create({
                at_se_student_id: targetStudentId,
                at_se_session_date: past2h,
                at_se_entry_time: past2h,
                at_se_status: "IN_PROGRESS",
            });
            recentSessionId = recentSession.at_se_id;

            // 3. Already Resolved Session (Historical Safety) - 24 hours ago, already APPROVED
            const past24h = new Date();
            past24h.setHours(past24h.getHours() - 24);
            const resolvedSession = await AttendanceSession.create({
                at_se_student_id: targetStudentId,
                at_se_session_date: past24h,
                at_se_entry_time: past24h,
                at_se_exit_time: new Date(past24h.getTime() + 60 * 60 * 1000), // exited 1h later
                at_se_total_minutes: 60,
                at_se_status: "APPROVED",
            });
            resolvedSessionId = resolvedSession.at_se_id;

            // 4. Boundary Safe (11 hours and 55 minutes ago)
            const past11h55m = new Date(Date.now() - (11 * 60 + 55) * 60 * 1000);
            const boundarySafe = await AttendanceSession.create({
                at_se_student_id: targetStudentId,
                at_se_session_date: past11h55m,
                at_se_entry_time: past11h55m,
                at_se_status: "IN_PROGRESS",
            });
            boundarySafeSessionId = boundarySafe.at_se_id;

            // 5. Boundary Orphan (12 hours and 5 minutes ago)
            const past12h05m = new Date(Date.now() - (12 * 60 + 5) * 60 * 1000);
            const boundaryOrphan = await AttendanceSession.create({
                at_se_student_id: targetStudentId,
                at_se_session_date: past12h05m,
                at_se_entry_time: past12h05m,
                at_se_status: "IN_PROGRESS",
            });
            boundaryOrphanSessionId = boundaryOrphan.at_se_id;
        });

        test("[Integration] Should correctly enforce time-window boundaries and bypass resolved sessions", async () => {
            // Act: Trigger the captured callback
            await triggerWorker();

            // Dynamic Polling Loop to avoid flaky tests (waiting for the 13h orphan session to update)
            let updatedOrphan = await AttendanceSession.findByPk(orphanSessionId);
            let retries = 0;
            while (updatedOrphan?.at_se_status === "IN_PROGRESS" && retries < 10) {
                await new Promise((resolve) => setTimeout(resolve, 50));
                updatedOrphan = await AttendanceSession.findByPk(orphanSessionId);
                retries++;
            }

            // Assert: Basic Orphan -> Closed (Approved with 720 mins)
            expect(updatedOrphan?.at_se_status).toBe("APPROVED");
            expect(updatedOrphan?.at_se_total_minutes).toBe(720);

            // Assert: Boundary Orphan (12h05m) -> Closed
            const updatedBoundaryOrphan = await AttendanceSession.findByPk(boundaryOrphanSessionId);
            expect(updatedBoundaryOrphan?.at_se_status).toBe("APPROVED");
            expect(updatedBoundaryOrphan?.at_se_total_minutes).toBe(720);

            // Assert: Boundary Safe (11h55m) -> Unchanged (IN_PROGRESS)
            const updatedBoundarySafe = await AttendanceSession.findByPk(boundarySafeSessionId);
            expect(updatedBoundarySafe?.at_se_status).toBe("IN_PROGRESS");
            expect(updatedBoundarySafe?.at_se_total_minutes).toBeNull();

            // Assert: Recent Session (2h) -> Unchanged (IN_PROGRESS)
            const updatedRecent = await AttendanceSession.findByPk(recentSessionId);
            expect(updatedRecent?.at_se_status).toBe("IN_PROGRESS");
            expect(updatedRecent?.at_se_total_minutes).toBeNull();

            // Assert: Historical Safety -> Unchanged (remains 60 mins, APPROVED)
            const updatedResolved = await AttendanceSession.findByPk(resolvedSessionId);
            expect(updatedResolved?.at_se_status).toBe("APPROVED");
            expect(updatedResolved?.at_se_total_minutes).toBe(60);
        });

        test("[Integration] Idempotence: Multiple Executions should not crash or corrupt data", async () => {
            // Act: Trigger the worker multiple times back-to-back
            await triggerWorker();
            await triggerWorker();
            await triggerWorker();

            // Wait a bit to ensure all background executions have finished
            await new Promise((resolve) => setTimeout(resolve, 200));

            // Assert: The basic orphan should still be exactly the same as before
            const finalOrphanState = await AttendanceSession.findByPk(orphanSessionId);
            expect(finalOrphanState?.at_se_status).toBe("APPROVED");
            expect(finalOrphanState?.at_se_total_minutes).toBe(720);

            // Assert: The boundary safe (11h55m) should STILL be IN_PROGRESS
            // (assuming the short test execution time didn't cross the 5 minute gap, which it won't)
            const finalBoundarySafe = await AttendanceSession.findByPk(boundarySafeSessionId);
            expect(finalBoundarySafe?.at_se_status).toBe("IN_PROGRESS");
        });
    });
});
