import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/shared/identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/shared/identity/domain/entities";

export abstract class UserDataSource {
    public abstract create(user: RegisterUserDto): Promise<UserEntity>;
    public abstract login(user: LoginUserDto): Promise<UserEntity>;
    public abstract update(id: string, user: UpdateUserDto): Promise<void>;
    public abstract changePassword(id: string, password: string): Promise<void>;
    public abstract changeStateActive(id: string): Promise<void>;
    public abstract findById(id: string): Promise<UserDataEntity>;
    public abstract findAll(): Promise<UserDataEntity[]>;
}
