import type { UserDataSource } from "@/app/shared/identity/domain/datasource/user.datasource";
import type { RegisterUserDto, LoginUserDto, UpdateUserDto } from "@/app/shared/identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/shared/identity/domain/entities";
import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";

export class UserRepositoryImpl implements UserRepository {
    public constructor(private readonly userDataSource: UserDataSource) {}

    public create(user: RegisterUserDto): Promise<UserEntity> {
        return this.userDataSource.create(user);
    }

    public login(user: LoginUserDto): Promise<UserEntity> {
        return this.userDataSource.login(user);
    }

    public update(id: string, user: UpdateUserDto): Promise<void> {
        return this.userDataSource.update(id, user);
    }

    public changePassword(id: string, password: string): Promise<void> {
        return this.userDataSource.changePassword(id, password);
    }

    public changeStateActive(id: string): Promise<void> {
        return this.userDataSource.changeStateActive(id);
    }

    public findById(id: string): Promise<UserDataEntity> {
        return this.userDataSource.findById(id);
    }

    public findAll(): Promise<UserDataEntity[]> {
        return this.userDataSource.findAll();
    }
}
