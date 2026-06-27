export abstract class UserSegurityDataSource {
    abstract checkUserActiveStatus(id: string): Promise<boolean>;
}
