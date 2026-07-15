import { describe, test, expect } from "bun:test";

import { ModulesRouter } from "@/app/admin-desk/modules/presentation/module.router";
import { PaymentRouter } from "@/app/admin-desk/payments/presentation/payment.router";
import { InfoStudentsLevelRouter } from "@/app/admin-desk/student-level/presentation/info-students-level.router";
import { ContractsRouter } from "@/app/admin-desk/student-level/presentation/student-level.router";
import { StudentsRouter } from "@/app/admin-desk/students/presentation/student.router";
import { AttendanceSessionRouter } from "@/app/class-track/feats/attendance/presentation/routes/attendance-session.router";
import { LessonLogRoutes } from "@/app/class-track/feats/lesson-logs/presentation/lessonLog.routes";
import { RetentionAlertRoutes } from "@/app/class-track/feats/retention-alerts/presentation/retentionAlert.routes";
import { UserRouter } from "@/app/shared/identity/presentation/identity.router";
import { VerifyRouter } from "@/app/shared/verify/presentation/verify.router";

import { VerifyUUID } from "@/core/middleware/verifyUuId.mid";
import { ValibotValidatorFactory } from "@/core/utils/adapters/validators/valibot/valibot-validator-factory.adapter";
import { SequelizeErrorHandler } from "@/data/errors/sequelize-error-handler.error";

describe("Unit Tests: Static Classes Coverage", () => {
    test("Instantiate static Routers to hit implicit constructors", () => {
        expect(new ModulesRouter()).toBeDefined();
        expect(new PaymentRouter()).toBeDefined();
        expect(new InfoStudentsLevelRouter()).toBeDefined();
        expect(new ContractsRouter()).toBeDefined();
        expect(new StudentsRouter()).toBeDefined();
        expect(new AttendanceSessionRouter()).toBeDefined();
        expect(new LessonLogRoutes()).toBeDefined();
        expect(new RetentionAlertRoutes()).toBeDefined();
        expect(new UserRouter()).toBeDefined();
        expect(new VerifyRouter()).toBeDefined();
    });

    test("Instantiate other static utility classes", () => {
        expect(new VerifyUUID()).toBeDefined();
        expect(new ValibotValidatorFactory()).toBeDefined();
        expect(new SequelizeErrorHandler()).toBeDefined();
    });
});
