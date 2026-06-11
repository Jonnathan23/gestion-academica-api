export abstract class RetentionAlertDatasource {
    public abstract upsertAlert(studentId: string, daysAbsent: number): Promise<void>;
}
