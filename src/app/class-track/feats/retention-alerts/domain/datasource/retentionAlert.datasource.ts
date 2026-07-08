import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-retention-alerts.dto";
import type { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/retention-alert.entity";
import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/retention-alert.interface";
import type { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/application/dtos/update-retention-alert.dto";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";

import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";

import type { GetCountAlertsDto } from "@/app/class-track/feats/retention-alerts/application/dtos/get-count-alerts.dto";

export abstract class RetentionAlertDatasource {
    public abstract upsertAlert(studentId: string, daysAbsent: number): Promise<void>;
    public abstract getAlerts(dto: GetRetentionAlertsDto): Promise<PaginatedResult<RetentionAlertWithStudentProjection>>;
    public abstract getCountAlerts(dto: GetCountAlertsDto): Promise<number>;
    public abstract updateAlertInfo(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity>;
    public abstract changeAlertStatus(id: string, status: RetentionAlertStatus): Promise<RetentionAlertEntity>;
}
