import type { StudentModuleStatus } from "@/core/interfaces/contracts.interface";
import type { Transaction } from "sequelize";
import Module from "@/data/models/admin-desk/module.model";
import StudentModule from "@/data/models/admin-desk/student-module.model";

export interface BulkCreateContractsProps {
    studentId: string;
    sellerId: string;
    modulesFromDb: Module[];
    transaction: Transaction;
}

export interface SelfHealingAlgorithmProps {
    allStudentContracts: StudentModule[];
    transaction: Transaction;
}

export interface CalculateNewStudentModuleStatusProps {
    statusRequested: StudentModuleStatus;
    currentIndex: number;
    targetModuleIndex: number;
    currentStatus: StudentModuleStatus;
}

export interface BuildStatusUpdatePromisesProps {
    studentModules: StudentModule[];
    targetModuleIndex: number;
    statusRequested: StudentModuleStatus;
    transaction: Transaction;
}
