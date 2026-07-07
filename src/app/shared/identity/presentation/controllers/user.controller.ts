import type { Request, Response, NextFunction } from "express";

//import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/shared/identity/domain/dtos";
import { RegisterUserDto } from "@/app/shared/identity/domain/dtos/RegisterUser.dto";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";

import type { UserRepository } from "@/app/shared/identity/domain/repositories/user.repository";
import { RegisterUser } from "@/app/shared/identity/application/use-cases/registerUser.use-case";
import { UpdateUser } from "@/app/shared/identity/application/use-cases/updateUser.use-case";
import { UpdateUserDto } from "@/app/shared/identity/domain/dtos/UpdateUser.dto";
import { LoginUserDto } from "@/app/shared/identity/domain/dtos";
import { LoginUser } from "@/app/shared/identity/application/use-cases/loginUser.use-case";
import { ChangePassword } from "@/app/shared/identity/application/use-cases/changePassword.use-case";
import { ChangeStateActive } from "@/app/shared/identity/application/use-cases/changeStateActive.use-case";
import { FindAllUsers } from "@/app/shared/identity/application/use-cases/findAllUsers.use-case";
import { FindUserById } from "@/app/shared/identity/application/use-cases/findUserById.use-case";
import type { UserDataEntity } from "@/app/shared/identity/domain/entities";

export class UserController {
    private readonly hoursCookie: number = 18;
    private readonly minutesCookie: number = 60;
    private readonly secondsCookie: number = 60;
    private readonly millisecondsCookie: number = 1000;

    private readonly maxAge = this.hoursCookie * this.minutesCookie * this.secondsCookie * this.millisecondsCookie;

    public constructor(
        private readonly userRepository: UserRepository,
        private readonly useSecureCookies: boolean,
    ) {}

    public registerUser = (req: Request, res: Response, next: NextFunction) => {
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

    public update = (req: Request, res: Response, next: NextFunction) => {
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

    public login = (req: Request, res: Response, next: NextFunction) => {
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
                    maxAge: this.maxAge,
                });

                const successMessage = "User logged in successfully";

                SuccessResponse.ok(res, successMessage, loginResponse.user);
            })
            .catch((error) => {
                next(error);
            });
    };

    public logout = (req: Request, res: Response, _next: NextFunction) => {
        //todo: realizar la lógica de desautenticación del usuario
        res.clearCookie("auth_token");
        const succesMessage = "User logged out successfully";

        SuccessResponse.ok(res, succesMessage);
    };

    public changePassword = (req: Request, res: Response, next: NextFunction) => {
        //TODO: refactorizar a un Dto con sus debidas validaciones
        const { id } = req.params;
        const { password } = req.body;

        const minPasswordLength: number = 6;

        if (!id) throw CustomError.badRequest("User is required");
        if (!password) throw CustomError.badRequest("Password is required");
        if (password.length < minPasswordLength) throw CustomError.badRequest("Password must be at least 6 characters long");

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

    public changeStateActive = (req: Request, res: Response, next: NextFunction) => {
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

    public findById = (req: Request, res: Response, next: NextFunction) => {
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

    public findAll = (req: Request, res: Response, next: NextFunction) => {
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
