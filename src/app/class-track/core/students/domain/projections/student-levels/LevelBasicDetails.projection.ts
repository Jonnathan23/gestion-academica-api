import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/StudentLevel.entity";

export const LevelBasicDetailsFields: readonly (keyof StudentLevelEntity)[] = ["id", "status", "freezeCount", "reactivateCount"];
