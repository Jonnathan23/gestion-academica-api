import type { StudentLevelEntity } from "@/app/admin-desk/student-level/domain/entities/student-level.entity";

export const levelBasicDetailsFields: readonly (keyof StudentLevelEntity)[] = ["id", "status", "freezeCount", "reactivateCount"];
