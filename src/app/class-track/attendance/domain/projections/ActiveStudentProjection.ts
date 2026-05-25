export interface ActiveStudentProjection {
    studentId: string;
    fullName: string;
    activeModule: string;
    isContractFrozen: boolean;
    freezeCount: number;
    reactivationCount: number;
}
