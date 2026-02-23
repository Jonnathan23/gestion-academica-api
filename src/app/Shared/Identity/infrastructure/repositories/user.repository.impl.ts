import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import type { RegisterUserDto, LoginUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
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

    update(user: UpdateUserDto): Promise<UserEntity> {
        return this.userDataSource.update(user);
    }

    changePassword(id: string, password: string): Promise<UserEntity> {
        return this.userDataSource.changePassword(id, password);
    }

    changeStateActive(id: string): Promise<UserEntity> {
        return this.userDataSource.changeStateActive(id);
    }

    findById(id: string): Promise<UserEntity> {
        return this.userDataSource.findById(id);
    }

    findAll(): Promise<UserEntity[]> {
        return this.userDataSource.findAll();
    }


}