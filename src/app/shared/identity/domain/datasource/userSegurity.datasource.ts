export abstract class UserSegurityDataSource {
    abstract checkUserActiveStatus(id: string): Promise<boolean>;
    //TODO: verificar si el JWT del usuario caduco
}
