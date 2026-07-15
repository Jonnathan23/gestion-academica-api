import type { StudentModuleStatus } from "@/core/interfaces/contracts.interface";

interface StudentLevelEntityProps {
    id?: string;
    studentId: string;
    moduleId: string;
    sellerId: string;
    status: StudentModuleStatus;
    freezeCount: number;
    reactivateCount: number;
    purchaseDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
    moduleLevel?: number;
}

export class StudentLevelEntity {
    public readonly id: string;
    public readonly studentId: string;
    public readonly moduleId: string;
    public readonly sellerId: string;
    public status: StudentModuleStatus;
    public readonly freezeCount: number;
    public readonly reactivateCount: number;
    public readonly purchaseDate: Date;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
    public readonly moduleLevel: number;

    public constructor(props: StudentLevelEntityProps) {
        this.id = props.id || "";
        this.studentId = props.studentId;
        this.moduleId = props.moduleId;
        this.sellerId = props.sellerId;
        this.status = props.status;
        this.freezeCount = props.freezeCount;
        this.reactivateCount = props.reactivateCount;
        this.purchaseDate = props.purchaseDate;
        this.createdAt = props.createdAt || new Date();
        this.updatedAt = props.updatedAt || new Date();
        this.moduleLevel = props.moduleLevel || 0;
    }

    public updateStatus(newStatus: StudentModuleStatus): void {
        this.status = newStatus;
    }
}
