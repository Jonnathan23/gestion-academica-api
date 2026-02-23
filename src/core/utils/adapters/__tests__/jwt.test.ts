import { describe, test, expect, mock } from "bun:test";

// ------------------------------------------------------------------ //
// IMPORTANT: mock.module must be called BEFORE importing JwtAdapter,
// because jwt.ts reads JWT_SEED from environmentVariables at module
// evaluation time. The mock intercepts that import first.
// ------------------------------------------------------------------ //
const TEST_JWT_SEED = "super-secret-test-seed-for-unit-tests";

mock.module("@/core/config", () => ({
    environmentVariables: {
        JWT_SEED: TEST_JWT_SEED,
        listeningPort: 3000,
        frontendUrl: "http://localhost:3000",
        databaseUrl: "postgres://localhost/test",
        nodeEnvironment: "test",
        documentationUrl: "",
        argumentValue: "",
    },
}));

// Import AFTER the mock is registered
const { JwtAdapter } = await import("@/core/utils/adapters/jwt");

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
            const token = await JwtAdapter.generateToken(validPayload) as string;
            const parts = token.split(".");

            // A well-formed JWT always has exactly 3 segments: header.payload.signature
            expect(parts).toHaveLength(3);
        });

        test("should return a token with the default 2-hour expiry when no duration is specified", async () => {
            const token = await JwtAdapter.generateToken(validPayload) as string;

            // Decode the payload segment (middle part) without verifying the signature
            const decodedPayload = JSON.parse(
                Buffer.from(token.split(".")[1]!, "base64url").toString("utf8")
            );

            // iat and exp should both be present; exp - iat ≈ 7200 seconds (2 hours)
            expect(decodedPayload).toHaveProperty("iat");
            expect(decodedPayload).toHaveProperty("exp");
            const durationInSeconds = decodedPayload.exp - decodedPayload.iat;
            expect(durationInSeconds).toBe(7200);
        });

        test("should embed the payload fields inside the token", async () => {
            const token = await JwtAdapter.generateToken(validPayload) as string;

            const decodedPayload = JSON.parse(
                Buffer.from(token.split(".")[1]!, "base64url").toString("utf8")
            );

            expect(decodedPayload.userId).toBe(validPayload.userId);
            expect(decodedPayload.email).toBe(validPayload.email);
        });

        test("should respect a custom expiry duration when provided", async () => {
            const token = await JwtAdapter.generateToken(validPayload, "1h") as string;

            const decodedPayload = JSON.parse(
                Buffer.from(token.split(".")[1]!, "base64url").toString("utf8")
            );

            const durationInSeconds = decodedPayload.exp - decodedPayload.iat;
            expect(durationInSeconds).toBe(3600);
        });
    });

    // ---------------------------------------------------------------- //
    // validateToken
    // ---------------------------------------------------------------- //
    describe("validateToken", () => {
        test("should return the decoded payload when a valid token is provided", async () => {
            const token = await JwtAdapter.generateToken(validPayload) as string;

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
            // Manually craft a token with a different seed using jsonwebtoken
            const jwt = await import("jsonwebtoken");
            const foreignToken = jwt.default.sign(validPayload, "totally-different-secret", {
                expiresIn: "1h",
            });

            const result = await JwtAdapter.validateToken<UserTokenPayload>(foreignToken);

            expect(result).toBeNull();
        });

        test("should return null for a structurally-valid but expired token", async () => {
            // Generate a token that expires immediately (1 ms in the past)
            const jwt = await import("jsonwebtoken");
            const expiredToken = jwt.default.sign(validPayload, TEST_JWT_SEED, {
                expiresIn: -1,
            });

            const result = await JwtAdapter.validateToken<UserTokenPayload>(expiredToken);

            expect(result).toBeNull();
        });
    });
});
