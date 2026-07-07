import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import type { GetRetentionAlertsDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/get-retention-alerts.dto";
import type { RetentionAlertWithStudentProjection } from "@/app/class-track/feats/retention-alerts/domain/projections/RetentionAlertWithStudent.projection";

import type { PaginatedResult } from "@/core/interfaces/paginated-result.interface";

export class GetRetentionAlertsUseCase {
    public constructor(private readonly repository: RetentionAlertRepository) {}

    public execute(dto: GetRetentionAlertsDto): Promise<PaginatedResult<RetentionAlertWithStudentProjection>> {
        return this.repository.getAlerts(dto);
    }
}
