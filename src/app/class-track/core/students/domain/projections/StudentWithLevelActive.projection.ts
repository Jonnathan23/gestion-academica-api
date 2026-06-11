export class StudentWithLevelActive {
    constructor(
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly activeModule: string,
        public readonly isContractValid: boolean,
        public readonly freezeCount: number,
        public readonly reactivationCount: number,
    ) {}
}
