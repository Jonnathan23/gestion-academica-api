import { describe, test, expect } from "bun:test";
import jwt from "jsonwebtoken";

import { JwtAdapter } from "@/core/utils/adapters/jwt";

// ------------------------------------------------------------------ //
// Test interfaces
// ------------------------------------------------------------------ //
interface UserTokenPayload {
    userId: string;
    email: string;
}

// ------------------------------------------------------------------ //
// Tests
// ------------------------------------------------------------------ //
describe("JwtAdapter", () => {
    const validPayload: UserTokenPayload = {
        userId: "uuid-001",
        email: "john.doe@example.com",
    };

    // ---------------------------------------------------------------- //
    // generateToken
    // ---------------------------------------------------------------- //
    describe("generateToken", () => {
        test("should return a non-null string token for a valid payload", async () => {
            const token = await JwtAdapter.generateToken(validPayload);

            expect(token).not.toBeNull();
            expect(typeof token).toBe("string");
            expect((token as string).length).toBeGreaterThan(0);
        });

        test("should return a JWT string composed of three dot-separated parts", async () => {
            const token = (await JwtAdapter.generateToken(validPayload)) as string;
            const parts = token.split(".");

            // A well-formed JWT always has exactly 3 segments: header.payload.signature
            expect(parts).toHaveLength(3);
        });

        test("should return a token with the default 20-hour expiry when no duration is specified", async () => {
            const token = (await JwtAdapter.generateToken(validPayload)) as string;

            // Decode the payload segment (middle part) without verifying the signature
            const decodedPayload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString("utf8"));

            // iat and exp should both be present; exp - iat ≈ 72000 seconds (20 hours)
            expect(decodedPayload).toHaveProperty("iat");
            expect(decodedPayload).toHaveProperty("exp");
            const durationInSeconds = decodedPayload.exp - decodedPayload.iat;
            expect(durationInSeconds).toBe(72000);
        });

        test("should embed the payload fields inside the token", async () => {
            const token = (await JwtAdapter.generateToken(validPayload)) as string;

            const decodedPayload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString("utf8"));

            expect(decodedPayload.userId).toBe(validPayload.userId);
            expect(decodedPayload.email).toBe(validPayload.email);
        });

        test("should respect a custom expiry duration when provided", async () => {
            const token = (await JwtAdapter.generateToken(validPayload, "1h")) as string;

            const decodedPayload = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString("utf8"));

            const durationInSeconds = decodedPayload.exp - decodedPayload.iat;
            expect(durationInSeconds).toBe(3600);
        });
    });

    // ---------------------------------------------------------------- //
    // validateToken
    // ---------------------------------------------------------------- //
    describe("validateToken", () => {
        test("should return the decoded payload when a valid token is provided", async () => {
            const token = (await JwtAdapter.generateToken(validPayload)) as string;

            const decoded = await JwtAdapter.validateToken<UserTokenPayload>(token);

            expect(decoded).not.toBeNull();
            expect(decoded!.userId).toBe(validPayload.userId);
            expect(decoded!.email).toBe(validPayload.email);
        });

        test("should return null when an arbitrary invalid string is provided", async () => {
            const result = await JwtAdapter.validateToken("this.is.not.a.valid.jwt");

            expect(result).toBeNull();
        });

        test("should return null when an empty string is provided", async () => {
            const result = await JwtAdapter.validateToken("");

            expect(result).toBeNull();
        });

        test("should return null for a token signed with a different secret", async () => {
            const foreignToken = jwt.sign({ ...validPayload }, "totally-different-secret", { expiresIn: "1h" });

            const result = await JwtAdapter.validateToken<UserTokenPayload>(foreignToken);

            expect(result).toBeNull();
        });

        test("should return null for a structurally-valid but expired token", async () => {
            // We need the real JwtSeed to craft an expired token that would
            // otherwise be valid. Import it from the real config.
            const { environmentVariables } = await import("@/core/config");
            const expiredToken = jwt.sign({ ...validPayload }, environmentVariables.JwtSeed, { expiresIn: -1 });

            const result = await JwtAdapter.validateToken<UserTokenPayload>(expiredToken);

            expect(result).toBeNull();
        });
    });
});
