import type { UserDataSource } from "@/app/Shared/Identity/domain/datasource/user.datasource";
import type { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import type { UserDataEntity, UserEntity } from "@/app/Shared/Identity/domain/entities";
import { UserMapper } from "@/app/Shared/Identity/infrastructure/mappers/user.mapper";
import { CustomError } from "@/core/error";
import { BcryptAdapter } from "@/core/utils";
import { User } from "@/data/models/Shared";
import { UserDataMapper } from "../mappers/userData.mapper";
import { userState } from "../../domain/interfaces/user.interfaces";

type HashFunction = typeof BcryptAdapter.hash;
type CompareFunction = typeof BcryptAdapter.compare;
type UserEntityFromObject = typeof UserMapper.userModelToEntity;
type UserDataEntityFromObject = typeof UserDataMapper.userModelToEntity;

export class UserDataSourceImpl implements UserDataSource {

    constructor(
        private readonly hashFunction: HashFunction = BcryptAdapter.hash,
        private readonly userEntityFromObject: UserEntityFromObject = UserMapper.userModelToEntity,
        private readonly compareFunction: CompareFunction = BcryptAdapter.compare,
        private readonly userDataEntityFromObject: UserDataEntityFromObject = UserDataMapper.userModelToEntity
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
        const { us_email, us_password_hash } = user
        try {
            const userExist = await User.findOne({ where: { us_email } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            if (!userExist.us_is_active) {
                throw CustomError.unauthorized("User is not active");
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

    async update(id: string, user: UpdateUserDto): Promise<void> {
        const { us_full_name, us_email, us_role } = user;

        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            await userExist.update(user.values)

            return;
        } catch (error) {
            throw error;
        }
    }

    async changePassword(id: string, password: string): Promise<void> {
        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            const passwordHash = await this.hashFunction(password);
            await userExist.update({ us_password_hash: passwordHash });

            return;
        } catch (error) {
            throw error;
        }
    }



    async changeStateActive(id: string): Promise<void> {
        //TODO: Implementar el cerrar sesion si se desactiva el usuario
        try {
            const userExist = await User.findOne({ where: { us_id: id } });
            if (!userExist) {
                throw CustomError.notFound("User not found");
            }

            await userExist.update({ us_is_active: !userExist.us_is_active });
            return;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<UserDataEntity> {
        try {
            const userFound = await User.findOne({ where: { us_id: id } });
            if (!userFound) {
                throw CustomError.notFound("User not found");
            }

            return this.userDataEntityFromObject(userFound);
        } catch (error) {
            throw (error);
        }
    }

    async findAll(): Promise<UserDataEntity[]> {
        try {
            const users = await User.findAll();
            return users.map(user => this.userDataEntityFromObject(user));
        } catch (error) {
            throw error;
        }
    }

    async checkUserActiveStatus(id: string): Promise<boolean> {
        try {
            const user = await User.findByPk(id, {
                attributes: ['us_is_active']
            });

            if (!user) return false;

            return user.us_is_active;
        } catch (error) {
            throw error;
        }
    }
}