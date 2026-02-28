import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { UserMapper } from "@/app/Shared/Identity/infrastructure/mappers/user.mapper";
import { CustomError } from "@/core/error";
import { BcryptAdapter } from "@/core/utils";
import { User } from "@/data/models/Shared";

type HashFunction = typeof BcryptAdapter.hash;
type CompareFunction = typeof BcryptAdapter.compare;
type UserEntityFromObject = typeof UserMapper.userModelToEntity;

export class UserDataSourceImpl implements UserDataSource {

    constructor(
        private readonly hashFunction: HashFunction = BcryptAdapter.hash,
        private readonly userEntityFromObject: UserEntityFromObject = UserMapper.userModelToEntity,
        private readonly compareFunction: CompareFunction = BcryptAdapter.compare
    ) { }


    async create(user: RegisterUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_password_hash, us_role } = user;
        try {
            const userExist = await User.findOne({ where: { us_email } });
            if (userExist) {
                throw CustomError.badRequest("User already exists");
            }
            const passwordHash = await this.hashFunction(us_password_hash);

            const user = await User.create({ us_full_name, us_email, us_password_hash: passwordHash, us_role });


            return this.userEntityFromObject(user);

        } catch (error) {
            throw error;
        }
    }

    async login(user: LoginUserDto): Promise<UserEntity> {
        const {us_email, us_password_hash} = user
        try {
            const userExist = await User.findOne({ where: { us_email } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }
            
            const isMatching = await this.compareFunction(us_password_hash, userExist.us_password_hash);
            if (!isMatching) {
                throw CustomError.unauthorized("Invalid credentials");
            }
            
            return this.userEntityFromObject(userExist);
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_role } = user;

        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            await userExist.update(user.values)

            return this.userEntityFromObject(userExist);

        } catch (error) {
            throw error;
        }
    }

    async changePassword(id: string, password: string): Promise<UserEntity> {
        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            const passwordHash = await this.hashFunction(password);
            await userExist.update({ us_password_hash: passwordHash });

            return this.userEntityFromObject(userExist);
        } catch (error) {
            throw error;
        }
    }



    async changeStateActive(id: string): Promise<UserEntity> {
        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            await userExist.update({ us_is_active: !userExist.us_is_active });
            return this.userEntityFromObject(userExist);
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<UserEntity> {
        try {
            const userFound = await User.findOne({ where: { us_id: id } });
            if (!userFound) {
                throw CustomError.notFound("User not found");
            }

            return this.userEntityFromObject(userFound);
        } catch (error) {
            throw (error);
        }
    }

    async findAll(): Promise<UserEntity[]> {
        try {
            const users = await User.findAll();
            return users.map(user => this.userEntityFromObject(user));
        } catch (error) {
            throw error;
        }
    }
}