import { Router } from "express";

import { ModulesRouter } from "@/app/admin-desk/modules/presentation/router";
import { StudentsRouter } from "@/app/admin-desk/students/presentation/router";
import { ContractsRouter } from "@/app/admin-desk/student-level/presentation/router";
import { UserRouter } from "@/app/shared/identity/presentation/router";
import { PaymentRouter } from "@/app/admin-desk/payments/presentation/router";
import { AuthMiddleware } from "@/core/middleware";
import { UserSegurityDataSourceImpl } from "@/app/shared/identity/infrastructure/datasources/userSegurity.datasource.impl";
import { AttendanceSessionRouter } from "@/app/class-track/feats/attendance/presentation/routes/attendanceSession.router";
import { LessonLogRouter } from "@/app/class-track/feats/attendance/presentation/routes/lessonLog.router";
import { DashboardRouter } from "@/app/class-track/feats/dashboard/presentation/routes/dashboard.router";
import { StudentRouterClassTrack } from "@/app/class-track/core/students/presentation/routes/student.router";

export class AppRouter {
    public static get routes(): Router {
        const router = Router();

        const userSegurityDataSource = new UserSegurityDataSourceImpl();

        const verify = (userId: string) => userSegurityDataSource.checkUserActiveStatus(userId);

        AuthMiddleware.configure(verify);

        // Shared
        router.use("/user", UserRouter.routes);

        // Admin Desk
        router.use("/modules", ModulesRouter.routes);

        router.use("/students", StudentsRouter.routes);

        router.use("/student-levels", ContractsRouter.routes);

        router.use("/payments", PaymentRouter.routes);

        // Class Track
        router.use("/attendance", AttendanceSessionRouter.routes);

        router.use("/lesson-log", LessonLogRouter.routes);

        router.use("/dashboard", DashboardRouter.routes);

        router.use("/class-track/students", StudentRouterClassTrack.routes);

        return router;
    }
}
