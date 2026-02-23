import type { Request, Response, NextFunction } from "express";

import type { UserRepository } from "@/app/Shared/Identity/domain/repositories/user.repository";
import { RegisterUserDto } from "@/app/Shared/Identity/domain/dtos";
import { RegisterUser } from "@/app/Shared/Identity/application/useCases/registerUser.use-case";
import { SuccessResponse } from "@/core/utils";
import { CustomError } from "@/core/error";


export class UserController {

    constructor(
        private readonly userRepository: UserRepository
    ) { }


    registerUser = (req: Request, res: Response, next: NextFunction) => {        
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        
        if (error) {
            throw CustomError.badRequest(error);
        }

        const registerUser = new RegisterUser(this.userRepository);

        registerUser.execute(registerUserDto!)
            .then(() => {
                const succesMessage = "User created successfully";
                SuccessResponse.created(res, succesMessage);
            })
            .catch(error => {
                next(error);
            });
    }

}