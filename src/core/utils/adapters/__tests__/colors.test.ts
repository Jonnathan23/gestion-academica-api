import { describe, test, expect } from "bun:test";
import { ColorsAdapter } from "@/core/utils/adapters/colors";

describe("ColorsAdapter Utility Test Suite", () => {

    const inputText = "hello world";

    describe("Bold color methods", () => {

        test("Should return a non-empty styled string from setBlueBold", () => {
            const result = ColorsAdapter.setBlueBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setCyanBold", () => {
            const result = ColorsAdapter.setCyanBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setRedBold", () => {
            const result = ColorsAdapter.setRedBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setGreenBold", () => {
            const result = ColorsAdapter.setGreenBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setYellowBold", () => {
            const result = ColorsAdapter.setYellowBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setMagentaBold", () => {
            const result = ColorsAdapter.setMagentaBold(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });
    });

    describe("Normal color methods", () => {

        test("Should return a non-empty styled string from setCyan", () => {
            const result = ColorsAdapter.setCyan(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setRed", () => {
            const result = ColorsAdapter.setRed(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setGreen", () => {
            const result = ColorsAdapter.setGreen(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setYellow", () => {
            const result = ColorsAdapter.setYellow(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });

        test("Should return a non-empty styled string from setMagenta", () => {
            const result = ColorsAdapter.setMagenta(inputText);

            expect(typeof result).toBe("string");
            expect(result.length).toBeGreaterThan(0);
            expect(result).toContain(inputText);
        });
    });
});