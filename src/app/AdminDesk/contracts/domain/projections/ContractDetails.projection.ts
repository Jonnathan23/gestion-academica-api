import type { StudentModuleStatus } from "@/app/AdminDesk/contracts/domain/interfaces/Contracts.interface";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { StudentEntity } from "@/app/AdminDesk/students/domain";
import type { UserEntity } from "@/app/Shared/Identity/domain/entities";

export const moduleRelationFields: readonly (keyof ModuleEntity)[] = [
    'mo_id',
    'mo_name',
    'mo_level'
] as const;

export const sellerRelationFields: readonly (keyof UserEntity)[] = [
    'us_id',
    'us_full_name',
    'us_email',
] as const;

export const studentRelationFields: readonly (keyof StudentEntity)[] = [
    'id',
    'identificationCard',
    'fullName',
    'email',
    "isGraduated",
    "contractStatus"
] as const;


export type ModuleRelation = Pick<ModuleEntity, typeof moduleRelationFields[number]>;
export type SellerRelation = Pick<UserEntity, typeof sellerRelationFields[number]>;
export type StudentRelation = Pick<StudentEntity, typeof studentRelationFields[number]>;

export class StudentLevelDetailsProjection {
    constructor(
        public readonly id: string,
        public readonly student: StudentRelation,
        public readonly module: ModuleRelation,
        public readonly seller: SellerRelation,
        public readonly status: StudentModuleStatus,
        public readonly purchaseDate: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}