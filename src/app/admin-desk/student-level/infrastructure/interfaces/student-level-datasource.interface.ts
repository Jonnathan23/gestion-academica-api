import type { StudentModuleStatus } from "@/core/interfaces/contracts.interface";
import type { Module, StudentModule } from "@/data/models/admin-desk";

import type { Transaction } from "sequelize";

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
