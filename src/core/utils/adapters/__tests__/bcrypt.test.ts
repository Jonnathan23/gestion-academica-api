import { describe, test, expect } from "bun:test";
import { BcryptAdapter } from "@/core/utils/adapters/bcrypt";

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("BcryptAdapter", () => {
    const plaintextPassword = "MySecretPassword123";

    // ---------------------------------------------------------------- //
    // hash
    // ---------------------------------------------------------------- //
    describe("hash", () => {
        test("should return a non-empty string when hashing a plaintext password", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            expect(typeof hashedPassword).toBe("string");
            expect(hashedPassword.length).toBeGreaterThan(0);
        });

        test("should return a value that is different from the original plaintext input", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            expect(hashedPassword).not.toBe(plaintextPassword);
        });

        test("should produce different hashes for the same password on each call (salted)", async () => {
            const firstHash = await BcryptAdapter.hash(plaintextPassword);
            const secondHash = await BcryptAdapter.hash(plaintextPassword);

            // bcrypt uses a random salt, so two hashes of the same input must differ
            expect(firstHash).not.toBe(secondHash);
        });

        test("should produce a hash starting with the bcrypt identifier '$2'", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            // All bcrypt hashes begin with $2a$, $2b$, or $2y$
            expect(hashedPassword.startsWith("$2")).toBe(true);
        });
    });

    // ---------------------------------------------------------------- //
    // compare
    // ---------------------------------------------------------------- //
    describe("compare", () => {
        test("should return true when the plaintext password matches the hash", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            const isMatch = await BcryptAdapter.compare(plaintextPassword, hashedPassword);

            expect(isMatch).toBe(true);
        });

        test("should return false when the plaintext password does not match the hash", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            const isMatch = await BcryptAdapter.compare("WrongPassword!", hashedPassword);

            expect(isMatch).toBe(false);
        });

        test("should return false when comparing an empty string against a valid hash", async () => {
            const hashedPassword = await BcryptAdapter.hash(plaintextPassword);

            const isMatch = await BcryptAdapter.compare("", hashedPassword);

            expect(isMatch).toBe(false);
        });

        test("should return true for a hash generated in the same test run", async () => {
            const freshPassword = "AnotherUniquePass!99";
            const freshHash = await BcryptAdapter.hash(freshPassword);

            const isMatch = await BcryptAdapter.compare(freshPassword, freshHash);

            expect(isMatch).toBe(true);
        });
    });
});
