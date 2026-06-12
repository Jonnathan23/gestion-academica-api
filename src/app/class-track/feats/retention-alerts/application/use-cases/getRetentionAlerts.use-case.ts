import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/GetRetentionAlerts.dto";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";

export class GetRetentionAlertsUseCase {
    constructor(private readonly repository: RetentionAlertRepository) {}

    public execute(dto: GetRetentionAlertsDto): Promise<RetentionAlertWithStudentProjection[]> {
        return this.repository.getAlerts(dto);
    }
}
