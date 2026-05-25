import type { Request, Response, NextFunction } from "express";
import type { AcademicObservationRepository } from "@/app/class-track/observation/domain/repositories/AcademicObservation.repository";
import { CreateAcademicObservationUseCase } from "@/app/class-track/observation/application/useCases/CreateAcademicObservation.use-case";
import { CreateAcademicObservationDto } from "@/app/class-track/observation/domain/dtos/CreateAcademicObservation.dto";
import { CustomError } from "@/core/error/customError.error";
import { SuccessResponse } from "@/core/utils/SuccesResponse";

export class AcademicObservationController {
    constructor(private readonly academicObservationRepository: AcademicObservationRepository) {}

    public createObservation = (req: Request, res: Response, next: NextFunction) => {
        const [error, dto] = CreateAcademicObservationDto.create(req.body);

        if (error || !dto) {
            return next(CustomError.badRequest(error || "Invalid request data"));
        }

        new CreateAcademicObservationUseCase(this.academicObservationRepository)
            .execute(dto)
            .then((observation) => SuccessResponse.created(res, "Academic observation created successfully", observation))
            .catch((error) => next(error));
    };
}
