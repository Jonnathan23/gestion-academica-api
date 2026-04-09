import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import type { RegisterUserDto, LoginUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/Shared/Identity/domain/entities";
import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";


export class UserRepositoryImpl implements UserRepository {

    constructor(
        private readonly userDataSource: UserDataSource
    ) { }

    create(user: RegisterUserDto): Promise<UserEntity> {
        return this.userDataSource.create(user);
    }


    login(user: LoginUserDto): Promise<UserEntity> {
        return this.userDataSource.login(user);
    }

    update(id: string, user: UpdateUserDto): Promise<void> {
        return this.userDataSource.update(id, user);
    }

    changePassword(id: string, password: string): Promise<void> {
        return this.userDataSource.changePassword(id, password);
    }

    changeStateActive(id: string): Promise<void> {
        return this.userDataSource.changeStateActive(id);
    }

    findById(id: string): Promise<UserDataEntity> {
        return this.userDataSource.findById(id);
    }

    findAll(): Promise<UserDataEntity[]> {
        return this.userDataSource.findAll();
    }


}