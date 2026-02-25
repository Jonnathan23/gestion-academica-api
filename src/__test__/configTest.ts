import { createGlobalErrorHandler } from "@/core/middleware";
import { SequelizeErrorHandler } from "@/data/errors/SequelizeErrorHandler";

export const testGlobalErrorHandler = () => createGlobalErrorHandler(new SequelizeErrorHandler())