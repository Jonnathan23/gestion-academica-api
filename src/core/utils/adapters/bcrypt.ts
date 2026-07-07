/* global Bun */
export class BcryptAdapter {
    public static async hash(password: string): Promise<string> {
        return await Bun.password.hash(password, {
            algorithm: "bcrypt",
            cost: 10,
        });
    }

    public static async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await Bun.password.verify(password, hashedPassword);
    }
}
