import { SequelizeErrorHandler } from "@/data/errors/sequelize-error-handler.error";
import { createGlobalErrorHandler } from "@/core/middleware/globalErrorHandler.mid";

export const testGlobalErrorHandler = () => createGlobalErrorHandler(new SequelizeErrorHandler());
