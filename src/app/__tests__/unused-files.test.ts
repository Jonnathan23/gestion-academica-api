import { describe, test, expect, mock } from "bun:test";

import { GetAllStudents } from "@/app/admin-desk/students/application/use-cases/get-all-students.use-case";
import { BlockLevel } from "@/app/admin-desk/student-level/application/use-cases/block-level.use-case";
import { UnlockLevel } from "@/app/admin-desk/student-level/application/use-cases/unlock-level.use-case";

import { StudentClassTrackProjection } from "@/app/class-track/core/students/domain/projections/StudentClassTrack.projection";
import { StudentMapper } from "@/app/class-track/core/students/infrastructure/mappers/student.mapper";

describe("Unit Tests: Unused or Edge-case Files Coverage", () => {
    describe("Use Cases", () => {
        test("GetAllStudents use case should call repository correctly", async () => {
            const mockRepo = {
                getAllStudents: mock(async () => []),
            } as any;

            const useCase = new GetAllStudents(mockRepo);
            const result = await useCase.execute();

            expect(mockRepo.getAllStudents).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        test("BlockLevel use case should call repository correctly", async () => {
            const mockRepo = {
                blockLevel: mock(async (dto) => ({ mocked: true, ...dto })),
            } as any;

            const useCase = new BlockLevel(mockRepo);
            const dto = { studentId: "123", moduleId: "456", notes: "test" } as any;
            const result = await useCase.execute(dto);

            expect(mockRepo.blockLevel).toHaveBeenCalledWith(dto);
            expect(result.mocked).toBe(true);
        });

        test("UnlockLevel use case should call repository correctly", async () => {
            const mockRepo = {
                unlockLevel: mock(async (dto) => ({ mocked: true, ...dto })),
            } as any;

            const useCase = new UnlockLevel(mockRepo);
            const dto = { studentId: "123", moduleId: "456", notes: "test" } as any;
            const result = await useCase.execute(dto);

            expect(mockRepo.unlockLevel).toHaveBeenCalledWith(dto);
            expect(result.mocked).toBe(true);
        });
    });

    describe("StudentMapper and Projection", () => {
        test("StudentClassTrackProjection creates correctly", () => {
            const proj = new StudentClassTrackProjection("id1", "card1", "name1");
            expect(proj.studentId).toBe("id1");
            expect(proj.identificationCard).toBe("card1");
            expect(proj.fullName).toBe("name1");
        });

        test("StudentMapper success", () => {
            const obj = {
                st_id: "id1",
                st_identification_card: "card1",
                st_full_name: "name1",
            };
            const mapped = StudentMapper.studentClassTrackProjectionFromObject(obj);
            expect(mapped.studentId).toBe("id1");
        });

        test("StudentMapper fails on missing st_id", () => {
            const obj = {
                st_identification_card: "card1",
                st_full_name: "name1",
            };
            expect(() => StudentMapper.studentClassTrackProjectionFromObject(obj)).toThrow();
        });

        test("StudentMapper fails on missing st_identification_card", () => {
            const obj = {
                st_id: "id1",
                st_full_name: "name1",
            };
            expect(() => StudentMapper.studentClassTrackProjectionFromObject(obj)).toThrow();
        });

        test("StudentMapper fails on missing st_full_name", () => {
            const obj = {
                st_id: "id1",
                st_identification_card: "card1",
            };
            expect(() => StudentMapper.studentClassTrackProjectionFromObject(obj)).toThrow();
        });
    });
});
