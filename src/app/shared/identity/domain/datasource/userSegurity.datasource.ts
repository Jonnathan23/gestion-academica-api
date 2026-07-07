export abstract class UserSegurityDataSource {
    public abstract checkUserActiveStatus(id: string): Promise<boolean>;
}
