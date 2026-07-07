import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import type { RetentionAlertDatasource } from "@/app/class-track/feats/retention-alerts/domain/datasource/retentionAlert.datasource";
import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/get-retention-alerts.dto";
import type { GetCountAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/get-count-alerts.dto";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";
import type { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/update-retention-alert.dto";
import type { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/retention-alert.entity";
import type { RetentionAlertStatus } from "@/data/models/class-track/retention-alert.model";

import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";

export class RetentionAlertRepositoryImpl implements RetentionAlertRepository {
    public constructor(private readonly datasource: RetentionAlertDatasource) {}

    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
        return this.datasource.upsertAlert(studentId, daysAbsent);
    }

    public async getAlerts(dto: GetRetentionAlertsDto): Promise<PaginatedResult<RetentionAlertWithStudentProjection>> {
        return this.datasource.getAlerts(dto);
    }

    public async getCountAlerts(dto: GetCountAlertsDto): Promise<number> {
        return this.datasource.getCountAlerts(dto);
    }

    public async updateAlertInfo(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity> {
        return this.datasource.updateAlertInfo(id, dto);
    }

    public async changeAlertStatus(id: string, status: RetentionAlertStatus): Promise<RetentionAlertEntity> {
        return this.datasource.changeAlertStatus(id, status);
    }
}
