import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/Shared/Identity/domain/entities";

export abstract class UserRepository {
    abstract create(user: RegisterUserDto): Promise<UserEntity>;
    abstract login(user: LoginUserDto): Promise<UserEntity>;
    abstract update(id: string, user: UpdateUserDto): Promise<void>;
    abstract changePassword(id: string, password: string): Promise<void>;
    abstract changeStateActive(id: string): Promise<void>;
    abstract findById(id: string): Promise<UserDataEntity>;
    abstract findAll(): Promise<UserDataEntity[]>;
}