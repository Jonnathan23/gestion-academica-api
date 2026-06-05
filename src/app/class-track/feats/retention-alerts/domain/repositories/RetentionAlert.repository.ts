export abstract class RetentionAlertRepository {
    public abstract upsertAlert(studentId: string, daysAbsent: number): Promise<void>;
}
