import { LoginUserDto } from "@/app/shared/identity/domain/dtos/login-user.dto";
import { RegisterUserDto } from "@/app/shared/identity/domain/dtos/register-user.dto";
import { UpdateUserDto } from "@/app/shared/identity/domain/dtos/update-user.dto";
import { UserDataEntity } from "@/app/shared/identity/domain/entities/user-data.entity";
import { UserEntity } from "@/app/shared/identity/domain/entities/user.entity";

export abstract class UserDataSource {
    public abstract create(user: RegisterUserDto): Promise<UserEntity>;
    public abstract login(user: LoginUserDto): Promise<UserEntity>;
    public abstract update(id: string, user: UpdateUserDto): Promise<void>;
    public abstract changePassword(id: string, password: string): Promise<void>;
    public abstract changeStateActive(id: string): Promise<void>;
    public abstract findById(id: string): Promise<UserDataEntity>;
    public abstract findAll(): Promise<UserDataEntity[]>;
}
