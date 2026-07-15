import { describe, test, expect } from "bun:test";
import { parse } from "valibot";

import { updateModuleSchema } from "@/app/admin-desk/modules/application/dtos/validators/schemas/valibot/update-module.schema";
import { searchStudentsByCriteriaSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/search-students-by-criteria.schema";
import { updateStudentSchema } from "@/app/admin-desk/students/application/dtos/validators/schemas/valibot/update-student.schema";
import { UpdateStudentLevelDto } from "@/app/admin-desk/student-level/application/dtos/update-student-level.dto";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";
import type { UpdateStudentLevelProps } from "@/app/admin-desk/student-level/application/dtos/interfaces/update-student-level.interface";

describe("Unit Tests: DTOs & Schemas Coverage", () => {
    describe("updateModuleSchema", () => {
        test("Should pass with valid mo_level", () => {
            const data = { mo_level: "3" };
            const result = parse(updateModuleSchema, data);
            expect(result.mo_level).toBe(3);
        });

        test("Should fail if mo_level is out of bounds", () => {
            expect(() => parse(updateModuleSchema, { mo_level: "0" })).toThrow();
            expect(() => parse(updateModuleSchema, { mo_level: "7" })).toThrow();
        });
    });

    describe("searchStudentsByCriteriaSchema", () => {
        test("Should handle st_is_graduated string transforms correctly", () => {
            expect(parse(searchStudentsByCriteriaSchema, { page: "1", st_is_graduated: "true" }).st_is_graduated).toBe(true);
            expect(parse(searchStudentsByCriteriaSchema, { page: "1", st_is_graduated: "false" }).st_is_graduated).toBe(false);
            expect(() => parse(searchStudentsByCriteriaSchema, { page: "1", st_is_graduated: "" })).toThrow();
            expect(parse(searchStudentsByCriteriaSchema, { page: "1", st_is_graduated: "random_string" }).st_is_graduated).toBe(
                "random_string",
            );
        });
    });

    describe("updateStudentSchema", () => {
        test("Should handle isGraduated string transforms correctly", () => {
            expect(parse(updateStudentSchema, { isGraduated: "true" }).isGraduated).toBe(true);
            expect(parse(updateStudentSchema, { isGraduated: "false" }).isGraduated).toBe(false);
        });

        test("Should throw validation error if isGraduated is not true or false string", () => {
            expect(() => parse(updateStudentSchema, { isGraduated: "invalid" })).toThrow();
        });
    });

    describe("UpdateStudentLevelDto", () => {
        test("Should return the correctly mapped values object", () => {
            const mockValidator: EntityValidator<UpdateStudentLevelProps> = {
                validate: (obj: any) => ({
                    studentLevelId: obj.studentLevelId,
                    studentId: obj.studentId,
                }),
            };

            const dto = UpdateStudentLevelDto.create({ studentLevelId: "123", studentId: "456" }, mockValidator);
            const values = dto.values;

            expect(values.studentLevelId).toBe("123");
            expect(values.studentId).toBe("456");
        });

        test("Should gracefully handle empty strings if they bypass validation", () => {
            const mockValidator: EntityValidator<UpdateStudentLevelProps> = {
                validate: (obj: any) => ({
                    studentLevelId: obj.studentLevelId,
                    studentId: obj.studentId,
                }),
            };

            const dto = UpdateStudentLevelDto.create({ studentLevelId: "", studentId: "" }, mockValidator);
            const values = dto.values;

            expect(values.studentLevelId).toBeUndefined();
            expect(values.studentId).toBeUndefined();
        });
    });
});
