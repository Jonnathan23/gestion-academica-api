import { userRoles } from "@/app/Shared/Identity/domain/entities/User.entity";

export const Validators = {
    isEmail: (email: string): boolean => {
        const emailRegularExpression = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegularExpression.test(email);
    },

    isStrongPassword: (password: string): boolean => {
        return password.length >= 6;
    },

    isRole: (role: string): boolean => {
        return role === userRoles.ADMIN || role === userRoles.TEACHER;
    }
};