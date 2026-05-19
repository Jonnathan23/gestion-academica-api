import type { UserDataSource } from "@/app/shared/Identity/domain/datasource/user.datasource";
import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/shared/Identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/shared/Identity/domain/entities";
import { UserMapper } from "@/app/shared/Identity/infrastructure/mappers/user.mapper";
import { UserDataMapper } from "@/app/shared/Identity/infrastructure/mappers/userData.mapper";
import { CustomError } from "@/core/error";
import { BcryptAdapter } from "@/core/utils";
import { User } from "@/data/models/Shared";

type HashFunction = typeof BcryptAdapter.hash;
type CompareFunction = typeof BcryptAdapter.compare;
type UserEntityFromObject = typeof UserMapper.userModelToEntity;
type UserDataEntityFromObject = typeof UserDataMapper.userModelToEntity;

export class UserDataSourceImpl implements UserDataSource {
    constructor(
        private readonly hashFunction: HashFunction = BcryptAdapter.hash,
        private readonly userEntityFromObject: UserEntityFromObject = UserMapper.userModelToEntity,
        private readonly compareFunction: CompareFunction = BcryptAdapter.compare,
        private readonly userDataEntityFromObject: UserDataEntityFromObject = UserDataMapper.userModelToEntity,
    ) {}

    async create(newUser: RegisterUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_password_hash, us_role } = newUser;

        const userExist = await User.findOne({ where: { us_email } });
        if (userExist) {
            throw CustomError.badRequest("User already exists");
        }
        const passwordHash = await this.hashFunction(us_password_hash);

        const user = await User.create({ us_full_name, us_email, us_password_hash: passwordHash, us_role });

        return this.userEntityFromObject(user);
    }

    async login(user: LoginUserDto): Promise<UserEntity> {
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

    async update(id: string, user: UpdateUserDto): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });
        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        await userExist.update(user.values);

        return;
    }

    async changePassword(id: string, password: string): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });
        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        const passwordHash = await this.hashFunction(password);
        await userExist.update({ us_password_hash: passwordHash });

        return;
    }

    async changeStateActive(id: string): Promise<void> {
        const userExist = await User.findOne({ where: { us_id: id } });
        if (!userExist) {
            throw CustomError.notFound("User not found");
        }

        await userExist.update({ us_is_active: !userExist.us_is_active });
        return;
    }

    async findById(id: string): Promise<UserDataEntity> {
        const userFound = await User.findOne({ where: { us_id: id } });
        if (!userFound) {
            throw CustomError.notFound("User not found");
        }

        return this.userDataEntityFromObject(userFound);
    }

    async findAll(): Promise<UserDataEntity[]> {
        const users = await User.findAll();
        return users.map((user) => this.userDataEntityFromObject(user));
    }
}
