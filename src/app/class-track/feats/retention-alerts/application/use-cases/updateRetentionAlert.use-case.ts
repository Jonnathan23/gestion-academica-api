import type { RetentionAlertRepository } from "@/app/class-track/feats/retention-alerts/domain/repositories/retentionAlert.repository";
import type { UpdateRetentionAlertDto } from "@/app/class-track/feats/retention-alerts/domain/dtos/UpdateRetentionAlert.dto";
import type { RetentionAlertEntity } from "@/app/class-track/feats/retention-alerts/domain/entities/RetentionAlert.entity";

export class UpdateRetentionAlertUseCase {
    public constructor(private readonly repository: RetentionAlertRepository) {}

    public async execute(id: string, dto: UpdateRetentionAlertDto): Promise<RetentionAlertEntity> {
        return this.repository.updateAlertInfo(id, dto);
    }
}
