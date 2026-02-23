import type { Request, Response, NextFunction } from "express";

import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { RegisterUserDto, UpdateUserDto } from "@/app/Shared/Identity/domain/dtos";
import { RegisterUser } from "@/app/Shared/Identity/application/useCases/registerUser.use-case";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";
import { UpdateUser } from "@/app/Shared/Identity/application/useCases/updateUser.use-cases";
import { FindAllUsers } from "@/app/Shared/Identity/application/useCases/findAllUsers.use-case";
import { UserEntity } from "@/app/Shared/Identity/domain/entities";


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