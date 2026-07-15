import { Router } from "express";

import { ModulesRouter } from "@/app/admin-desk/modules/presentation/module.router";
import { StudentsRouter } from "@/app/admin-desk/students/presentation/student.router";
import { ContractsRouter } from "@/app/admin-desk/student-level/presentation/student-level.router";
import { UserRouter } from "@/app/shared/identity/presentation/identity.router";
import { VerifyRouter } from "@/app/shared/verify/presentation/verify.router";
import { PaymentRouter } from "@/app/admin-desk/payments/presentation/payment.router";
import { UserSegurityDataSourceImpl } from "@/app/shared/identity/infrastructure/datasources/user-segurity.datasource.impl";
import { AttendanceSessionRouter } from "@/app/class-track/feats/attendance/presentation/routes/attendance-session.router";

import { DashboardRouter } from "@/app/class-track/feats/dashboard/presentation/routes/dashboard.router";
import { StudentRouterClassTrack } from "@/app/class-track/core/students/presentation/routes/student.router";
import { RetentionAlertRoutes } from "@/app/class-track/feats/retention-alerts/presentation/retentionAlert.routes";
import { LessonLogRoutes } from "@/app/class-track/feats/lesson-logs/presentation/lessonLog.routes";
import { AuthMiddleware } from "@/core/middleware/auth.mid";

export class AppRouter {
    public static get routes(): Router {
        const router = Router();

        const userSegurityDataSource = new UserSegurityDataSourceImpl();

        const verify = (userId: string) => userSegurityDataSource.checkUserActiveStatus(userId);

        AuthMiddleware.configure(verify);

        // Shared
        router.use("/user", UserRouter.routes);
        router.use("/verify", VerifyRouter.routes);

        // Admin Desk
        router.use("/modules", ModulesRouter.routes);

        router.use("/students", StudentsRouter.routes);

        router.use("/student-levels", ContractsRouter.routes);

        router.use("/payments", PaymentRouter.routes);

        // Class Track
        router.use("/attendance", AttendanceSessionRouter.routes);

        router.use("/lesson-log", LessonLogRoutes.routes);

        router.use("/dashboard", DashboardRouter.routes);

        router.use("/class-track/students", StudentRouterClassTrack.routes);

        router.use("/class-track/retention-alerts", RetentionAlertRoutes.routes);

        return router;
    }
}
