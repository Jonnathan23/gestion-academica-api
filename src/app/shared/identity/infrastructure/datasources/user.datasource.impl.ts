import type { UserDataSource } from "@/app/shared/identity/domain/datasource/user.datasource";
import { UserMapper } from "@/app/shared/identity/infrastructure/mappers/user.mapper";
import { UserDataMapper } from "@/app/shared/identity/infrastructure/mappers/user-data.mapper";
import { LoginUserDto } from "@/app/shared/identity/domain/dtos/login-user.dto";
import { RegisterUserDto } from "@/app/shared/identity/domain/dtos/register-user.dto";
import { UpdateUserDto } from "@/app/shared/identity/domain/dtos/update-user.dto";
import { UserDataEntity } from "@/app/shared/identity/domain/entities/user-data.entity";
import { UserEntity } from "@/app/shared/identity/domain/entities/user.entity";
import { CustomError } from "@/core/error/customError.error";
import { BcryptAdapter } from "@/core/utils/adapters/bcrypt";
import User from "@/data/models/shared/user.model";

type HashFunction = typeof BcryptAdapter.hash;
type CompareFunction = typeof BcryptAdapter.compare;
type UserEntityFromObject = typeof UserMapper.userModelToEntity;
type UserDataEntityFromObject = typeof UserDataMapper.userModelToEntity;

export class UserDataSourceImpl implements UserDataSource {
    public constructor(
        private readonly hashFunction: HashFunction = BcryptAdapter.hash,
        private readonly userEntityFromObject: UserEntityFromObject = UserMapper.userModelToEntity,
        private readonly compareFunction: CompareFunction = BcryptAdapter.compare,
        private readonly userDataEntityFromObject: UserDataEntityFromObject = UserDataMapper.userModelToEntity,
    ) {}

    public async create(newUser: RegisterUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_password_hash, us_role } = newUser;

        const userExist = await User.findOne({ where: { us_email } });

        if (userExist) {
            throw CustomError.badRequest("User already exists");
        }
        const passwordHash = await this.hashFunction(us_password_hash);

        const user = await User.create({ us_full_name, us_email, us_password_hash: passwordHash, us_role });

        return this.userEntityFromObject(user);
    }

    public async login(user: LoginUserDto): Promise<UserEntity> {
        const { us_email, us_password_hash } = user;

        const userExist = await User.findOne({ where: { us_email } });

        if (!userExist) {
            throw CustomError.notFound("Invalid credentials");
        }

        if (!userExist.us_is_active) {
            throw CustomError.unauthorized("User is not active");
        }

        const isMatching = await this.compareFunction(us_password_hash, userExist.us_password_hash);

        if (!isMatching) {
            throw CustomError.unauthorized("Invalid credentials");
        }

        return this.userEntityFromObject(userExist);
    }

    public async update(id: string, user: UpdateUserDto): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });

        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        await userExist.update(user.values);

        return;
    }

    public async changePassword(id: string, password: string): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });

        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        const passwordHash = await this.hashFunction(password);

        await userExist.update({ us_password_hash: passwordHash });

        return;
    }

    public async changeStateActive(id: string): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });

        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        await userExist.update({ us_is_active: !userExist.us_is_active });

        return;
    }

    public async findById(id: string): Promise<UserDataEntity> {
        const userFound = await User.findOne({ where: { us_id: id } });

        if (!userFound) {
            throw CustomError.notFound("User not found");
        }

        return this.userDataEntityFromObject(userFound);
    }

    public async findAll(): Promise<UserDataEntity[]> {
        const users = await User.findAll();

        return users.map((user) => this.userDataEntityFromObject(user));
    }
}
