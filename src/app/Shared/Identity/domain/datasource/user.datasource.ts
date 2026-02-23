import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";

export abstract class UserDataSource {
    abstract create(user: RegisterUserDto): Promise<UserEntity>;
    abstract login(user: LoginUserDto): Promise<UserEntity>;
    abstract update(user: UpdateUserDto): Promise<UserEntity>;
    abstract changePassword(id: string, password: string): Promise<UserEntity>;
    abstract changeStateActive(id: string): Promise<UserEntity>;
    abstract findById(id: string): Promise<UserEntity>;
    abstract findAll(): Promise<UserEntity[]>;
}