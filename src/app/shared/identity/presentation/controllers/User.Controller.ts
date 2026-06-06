import type { Request, Response, NextFunction } from "express";

//import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/shared/Identity/domain/dtos";
import { RegisterUserDto } from "@/app/shared/identity/domain/dtos/RegisterUser.dto";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";

import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";
import { RegisterUser } from "@/app/shared/identity/application/useCases/registerUser.use-case";
import { UpdateUser } from "@/app/shared/identity/application/useCases/updateUser.use-case";
import { UpdateUserDto } from "@/app/shared/identity/domain/dtos/UpdateUser.dto";
import { LoginUserDto } from "@/app/shared/identity/domain/dtos";
import { LoginUser } from "@/app/shared/identity/application/useCases/loginUser.use-case";

export class UserController {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly useSecureCookies: boolean,
    ) {}

    registerUser = (req: Request, res: Response, next: NextFunction) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const registerUser = new RegisterUser(this.userRepository);

        registerUser
            .execute(registerUserDto!)
            .then(() => {
                const succesMessage = "User created successfully";
                SuccessResponse.created(res, succesMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    update = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const [error, updateUserDto] = UpdateUserDto.create(req.body);

        if (!id) throw CustomError.badRequest("User is required");
        if (error) throw CustomError.badRequest(error);

        const updateUser = new UpdateUser(this.userRepository);

        updateUser
            .execute(id.toString(), updateUserDto!)
            .then(() => {
                const succesMessage = "User updated successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    login = (req: Request, res: Response, next: NextFunction) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const loginUser = new LoginUser(this.userRepository);

        loginUser
            .execute(loginUserDto!)
            .then((loginResponse) => {
                res.cookie("auth_token", loginResponse.token, {
                    httpOnly: true,
                    secure: this.useSecureCookies,
                    sameSite: "lax",
                    maxAge: 18 * 60 * 60 * 1000,
                });

                const successMessage = "User logged in successfully";

                SuccessResponse.ok(res, successMessage, loginResponse.user);
            })
            .catch((error) => {
                next(error);
            });
    };

    logout = (req: Request, res: Response, next: NextFunction) => {
        //todo: realizar la lógica de desautenticación del usuario
        res.clearCookie("auth_token");
        const succesMessage = "User logged out successfully";
        SuccessResponse.ok(res, succesMessage);
    };

    changePassword = (req: Request, res: Response, next: NextFunction) => {
        //TODO: refactorizar a un Dto con sus debidas validaciones
        const { id } = req.params;
        const { password } = req.body;

        if (!id) throw CustomError.badRequest("User is required");
        if (!password) throw CustomError.badRequest("Password is required");
        if (password.length < 6) throw CustomError.badRequest("Password must be at least 6 characters long");

        const changePassword = new ChangePassword(this.userRepository);

        changePassword
            .execute(id.toString(), password)
            .then(() => {
                const succesMessage = "Password changed successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    changeStateActive = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) throw CustomError.badRequest("User is required");

        const changeStateActive = new ChangeStateActive(this.userRepository);

        changeStateActive
            .execute(id.toString())
            .then(() => {
                const succesMessage = "State changed successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch((error) => {
                next(error);
            });
    };

    findById = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) throw CustomError.badRequest("User is required");

        const findById = new FindUserById(this.userRepository);

        findById
            .execute(id.toString())
            .then((user) => {
                const succesMessage = "User found successfully";
                SuccessResponse.ok<UserDataEntity>(res, succesMessage, user);
            })
            .catch((error) => {
                next(error);
            });
    };

    findAll = (req: Request, res: Response, next: NextFunction) => {
        const findAll = new FindAllUsers(this.userRepository);

        findAll
            .execute()
            .then((users) => {
                const succesMessage = "Users found successfully";
                SuccessResponse.ok<UserDataEntity[]>(res, succesMessage, users);
            })
            .catch((error) => {
                next(error);
            });
    };
}
