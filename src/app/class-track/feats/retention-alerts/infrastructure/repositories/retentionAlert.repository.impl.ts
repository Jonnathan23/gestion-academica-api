import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import type { RetentionAlertDatasource } from "@/app/class-track/feats/retention-alerts/domain/datasource/retentionAlert.datasource";

export class RetentionAlertRepositoryImpl implements RetentionAlertRepository {
    constructor(private readonly datasource: RetentionAlertDatasource) {}

    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
        return this.datasource.upsertAlert(studentId, daysAbsent);
    }
}
