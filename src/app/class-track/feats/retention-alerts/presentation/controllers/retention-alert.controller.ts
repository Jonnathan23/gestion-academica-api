import type { Request, Response, NextFunction } from "express";

import { SuccessResponse } from "@/core/utils/success-response";

import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retention-alert.repository";
import { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-retention-alerts.dto";
import { GetRetentionAlertsUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/get-retention-alerts.use-case";
import { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/application/dtos/update-retention-alert.dto";
import { UpdateRetentionAlertUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/update-retention-alert.use-case";
import { ChangeRetentionAlertStatusDto } from "@/app/class-track/feats/retention-alerts/application/dtos/change-retention-alert-status.dto";
import { ChangeRetentionAlertStatusUseCase } from "@/app/class-track/feats/retention-alerts/application/use-cases/change-retention-alert-status.use-case";
import type { RetentionAlertsValidators } from "@/app/class-track/feats/retention-alerts/application/dtos/validators/interfaces/retention-alerts-validators.interface";

export class RetentionAlertController {
    public constructor(
        private readonly repository: RetentionAlertRepository,
        private readonly validators: RetentionAlertsValidators,
    ) {}

    public getAlerts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getRetentionAlertsDto = GetRetentionAlertsDto.create(
                req.query as Record<string, unknown>,
                this.validators.getRetentionAlertsValidator,
            );
            const useCase = new GetRetentionAlertsUseCase(this.repository);

            const paginatedResult = await useCase.execute(getRetentionAlertsDto);

            return SuccessResponse.ok(res, "Retention alerts fetched successfully", paginatedResult);
        } catch (error) {
            next(error);
        }
    };

    public updateAlertInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const updateRetentionAlertDto = UpdateRetentionAlertDto.create(
                req.body as Record<string, unknown>,
                this.validators.updateRetentionAlertValidator,
            );

            const useCase = new UpdateRetentionAlertUseCase(this.repository);

            const alert = await useCase.execute(id, updateRetentionAlertDto);

            return SuccessResponse.ok(res, "Retention alert updated successfully", alert);
        } catch (error) {
            next(error);
        }
    };

    public changeStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            const changeRetentionAlertStatusDto = ChangeRetentionAlertStatusDto.create(
                req.body as Record<string, unknown>,
                this.validators.changeRetentionAlertStatusValidator,
            );

            const useCase = new ChangeRetentionAlertStatusUseCase(this.repository);

            const alert = await useCase.execute(id, changeRetentionAlertStatusDto);

            return SuccessResponse.ok(res, "Retention alert status changed successfully", alert);
        } catch (error) {
            next(error);
        }
    };
}
