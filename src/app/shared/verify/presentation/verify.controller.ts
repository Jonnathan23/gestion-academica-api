import type { Response } from "express";
import { SuccessResponse } from "@/core/utils";
import type { AuthRequest } from "@/core/middleware";

export class VerifyController {
    public verifyUser = (req: AuthRequest, res: Response) => {
        SuccessResponse.ok(res, "Valid user session", req.userSession);
    };

    public verifyStudent = (req: AuthRequest, res: Response) => {
        SuccessResponse.ok(res, "Valid student session", req.studentSession);
    };
}
