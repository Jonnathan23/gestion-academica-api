import type { Request, Response, NextFunction } from "express";

import { SuccessResponse } from "@/core/utils/SuccesResponse";
import { CustomError } from "@/core/error/customError.error";

import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/GetRetentionAlerts.dto";
import { GetRetentionAlertsUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/getRetentionAlerts.use-case";
import { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/UpdateRetentionAlert.dto";
import { UpdateRetentionAlertUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/updateRetentionAlert.use-case";
import { ChangeRetentionAlertStatusDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/ChangeRetentionAlertStatus.dto";
import { ChangeRetentionAlertStatusUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/changeRetentionAlertStatus.use-case";

export class RetentionAlertController {
    constructor(private readonly repository: RetentionAlertRepository) {}

    public getAlerts = (req: Request, res: Response, next: NextFunction) => {
        const [error, getRetentionAlertsDto] = GetRetentionAlertsDto.create(req.query);

        if (error || !getRetentionAlertsDto) {
            return next(CustomError.badRequest(error || "Invalid request parameters"));
        }

        const useCase = new GetRetentionAlertsUseCase(this.repository);

        useCase
            .execute(getRetentionAlertsDto)
            .then((paginatedResult) => SuccessResponse.ok(res, "Retention alerts fetched successfully", paginatedResult))
            .catch((err) => next(err));
    };

    public updateAlertInfo = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id as string;
        const [error, updateRetentionAlertDto] = UpdateRetentionAlertDto.create(req.body);

        if (error || !updateRetentionAlertDto) {
            return next(CustomError.badRequest(error || "Invalid request body"));
        }

        const useCase = new UpdateRetentionAlertUseCase(this.repository);

        useCase
            .execute(id, updateRetentionAlertDto)
            .then((alert) => SuccessResponse.ok(res, "Retention alert updated successfully", alert))
            .catch((err) => next(err));
    };

    public changeStatus = (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id as string;
        const [error, changeRetentionAlertStatusDto] = ChangeRetentionAlertStatusDto.create(req.body);

        if (error || !changeRetentionAlertStatusDto) {
            return next(CustomError.badRequest(error || "Invalid status update request"));
        }

        const useCase = new ChangeRetentionAlertStatusUseCase(this.repository);

        useCase
            .execute(id, changeRetentionAlertStatusDto)
            .then((alert) => SuccessResponse.ok(res, "Retention alert status changed successfully", alert))
            .catch((err) => next(err));
    };
}
