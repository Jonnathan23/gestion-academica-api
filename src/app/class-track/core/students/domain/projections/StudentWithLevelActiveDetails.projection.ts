export interface ModuleInfo {
    moId: string;
    moName: string;
    moLevel: number;
}

export class StudentWithLevelActiveDetails {
    constructor(
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly activeModule: string,
        public readonly isContractValid: boolean,
        public readonly freezeCount: number,
        public readonly reactivationCount: number,
        public readonly moduleInfo: ModuleInfo,
    ) {}
}
