import { compareSync, hashSync } from 'bcryptjs';


export const BcryptAdapter = {
    hash(password: string): string {
        return hashSync(password);
    },

    compare(password: string, hashedPassword: string): boolean {
        return compareSync(password, hashedPassword);
    }
}