import type { Request, Response, NextFunction } from "express";

import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";
import { ChangePassword, ChangeStateActive, FindAllUsers, FindUserById, LoginUser, RegisterUser, UpdateUser } from "@/app/Shared/Identity/application";


export class UserController {

    constructor(
        private readonly userRepository: UserRepository
    ) { }


    registerUser = (req: Request, res: Response, next: NextFunction) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const registerUser = new RegisterUser(this.userRepository);

        registerUser.execute(registerUserDto!)
            .then(() => {
                const succesMessage = "User created successfully";
                SuccessResponse.created(res, succesMessage);
            })
            .catch(error => { next(error); });
    }

    update = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const [error, updateUserDto] = UpdateUserDto.create(req.body);

        if (!id) throw CustomError.badRequest("User is required");
        if (error) throw CustomError.badRequest(error);

        const updateUser = new UpdateUser(this.userRepository);

        updateUser.execute(id.toString(), updateUserDto!)
            .then(() => {
                const succesMessage = "User updated successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch(error => { next(error); });
    }

    login = (req: Request, res: Response, next: NextFunction) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        const loginUser = new LoginUser(this.userRepository);

        loginUser.execute(loginUserDto!)
            .then((user) => {
                const succesMessage = "User logged in successfully";
                SuccessResponse.ok(res, succesMessage, user);
            })
            .catch(error => { next(error); });
    }

    changePassword = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { password } = req.body;

        if (!id) throw CustomError.badRequest("User is required");
        if (!password) throw CustomError.badRequest("Password is required");
        if(password.length < 6) throw CustomError.badRequest("Password must be at least 6 characters long");

        const changePassword = new ChangePassword(this.userRepository);

        changePassword.execute(id.toString(), password)
            .then(() => {
                const succesMessage = "Password changed successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch(error => { next(error); });
    }

    changeStateActive = (req: Request, res: Response, next: NextFunction) => {        
        const { id } = req.params;        

        if (!id) throw CustomError.badRequest("User is required");        

        const changeStateActive = new ChangeStateActive(this.userRepository);

        changeStateActive.execute(id.toString())
            .then(() => {
                const succesMessage = "State changed successfully";
                SuccessResponse.ok(res, succesMessage);
            })
            .catch(error => { next(error); });
    }
    

    findById = (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        if (!id) throw CustomError.badRequest("User is required");

        const findById = new FindUserById(this.userRepository);

        findById.execute(id.toString())
            .then((user) => {
                const succesMessage = "User found successfully";
                SuccessResponse.ok<UserEntity>(res, succesMessage, user);
            })
            .catch(error => { next(error); });
    }

    findAll = (req: Request, res: Response, next: NextFunction) => {
        const findAll = new FindAllUsers(this.userRepository);

        findAll.execute()
            .then((users) => {
                const succesMessage = "Users found successfully";
                SuccessResponse.ok<UserEntity[]>(res, succesMessage, users);
            })
            .catch(error => { next(error); });
    }

}