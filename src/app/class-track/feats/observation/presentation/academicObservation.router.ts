import { Router } from "express";
import { AcademicObservationDatasourceImpl } from "@/app/class-track/feats/observation/infrastructure/datasource/AcademicObservation.datasource.impl";
import { AcademicObservationRepositoryImpl } from "@/app/class-track/feats/observation/infrastructure/repositories/AcademicObservation.repository.impl";
import { AcademicObservationController } from "@/app/class-track/feats/observation/presentation/AcademicObservation.controller";

export class AcademicObservationRouter {
    public static get routes(): Router {
        const router = Router();

        const datasource = new AcademicObservationDatasourceImpl();
        const repository = new AcademicObservationRepositoryImpl(datasource);
        const controller = new AcademicObservationController(repository);

        router.post("/observations", controller.createObservation);

        return router;
    }
}
