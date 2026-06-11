import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/GetRetentionAlerts.dto";
import type { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/RetentionAlert.entity";
import type { RetentionAlertStatus } from "@/app/class-track/feats/retention-alerts/domain/interfaces/RetentionAlert.interface";
import type { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/UpdateRetentionAlert.dto";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";

export abstract class RetentionAlertDatasource {
    public abstract upsertAlert(studentId: string, daysAbsent: number): Promise<void>;
    public abstract getAlerts(dto: GetRetentionAlertsDto): Promise<RetentionAlertWithStudentProjection[]>;
    public abstract updateAlertInfo(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity>;
    public abstract changeAlertStatus(id: string, status: RetentionAlertStatus): Promise<RetentionAlertEntity>;
}
