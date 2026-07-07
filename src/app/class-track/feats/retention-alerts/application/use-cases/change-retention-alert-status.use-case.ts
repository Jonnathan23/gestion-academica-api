import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import { ChangeRetentionAlertStatusDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/change-retention-alert-status.dto";
import { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/retention-alert.entity";

export class ChangeRetentionAlertStatusUseCase {
    public constructor(private readonly repository: RetentionAlertRepository) {}

    public execute(id: string, dto: ChangeRetentionAlertStatusDto): Promise<RetentionAlertEntity> {
        return this.repository.changeAlertStatus(id, dto.status);
    }
}
