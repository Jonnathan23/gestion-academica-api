import { createGlobalErrorHandler } from "@/core/middleware";
import { SequelizeErrorHandler } from "@/data/errors/sequelize-error-handler.error";

export const testGlobalErrorHandler = () => createGlobalErrorHandler(new SequelizeErrorHandler());
