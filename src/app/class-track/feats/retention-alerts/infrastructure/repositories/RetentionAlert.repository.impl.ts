import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/RetentionAlert.repository";
import type { RetentionAlertDatasource } from "@/app/class-track/feats/retention-alerts/domain/datasource/RetentionAlert.datasource";

export class RetentionAlertRepositoryImpl implements RetentionAlertRepository {
    constructor(private readonly datasource: RetentionAlertDatasource) {}

    public async upsertAlert(studentId: string, daysAbsent: number): Promise<void> {
        return this.datasource.upsertAlert(studentId, daysAbsent);
    }
}
