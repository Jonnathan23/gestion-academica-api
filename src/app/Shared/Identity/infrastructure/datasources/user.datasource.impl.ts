import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { UserMapper } from "@/app/Shared/Identity/infrastructure/mappers/user.mapper";
import { CustomError } from "@/core/error";
import { BcryptAdapter } from "@/core/utils";
import { User } from "@/data/models/Shared";

type HashFunction = typeof BcryptAdapter.hash;
type UserEntityFromObject = typeof UserMapper.userModelToEntity;

export class UserDataSourceImpl implements UserDataSource {

    constructor(
        private readonly hashFunction: HashFunction = BcryptAdapter.hash,
        private readonly userEntityFromObject: UserEntityFromObject = UserMapper.userModelToEntity
    ) { }


    async create(user: RegisterUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_password_hash, us_role } = user;
        try {
            const userExist = await User.findOne({ where: { us_email } });
            if (userExist) {
                throw CustomError.badRequest("User already exists");
            }
            const passwordHash = this.hashFunction(us_password_hash);

            const user = await User.create({ us_full_name, us_email, us_password_hash: passwordHash, us_role });


            return this.userEntityFromObject(user);

        } catch (error) {
            throw error;
        }
    }

    login(user: LoginUserDto): Promise<UserEntity> {
        //TODO: Implementar login
        throw new Error("Method not implemented.");
    }

    async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
        const { us_full_name, us_email, us_role } = user;

        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            await userExist.update({
                us_full_name: us_full_name ? us_full_name : userExist.us_full_name,
                us_email: us_email ? us_email : userExist.us_email,
                us_role: us_role ? us_role : userExist.us_role
            })

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

            const passwordHash = this.hashFunction(password);
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