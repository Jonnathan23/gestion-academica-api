import type { Response } from "express";
import { SuccessResponse } from "@/core/utils/success-response";
import type { AuthRequest } from "@/core/middleware/auth.mid";

export class VerifyController {
    public verifyUser = (req: AuthRequest, res: Response) => {
        SuccessResponse.ok(res, "Valid user session", req.userSession);
    };

    public verifyStudent = (req: AuthRequest, res: Response) => {
        SuccessResponse.ok(res, "Valid student session", req.studentSession);
    };
}
