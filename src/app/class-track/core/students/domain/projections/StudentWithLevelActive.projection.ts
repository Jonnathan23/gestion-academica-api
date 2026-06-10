export class StudentWithLevelActive {
    constructor(
        public readonly studentId: string,
        public readonly fullName: string,
        public readonly activeModule: string,
        public readonly isContractFrozen: boolean,
        public readonly freezeCount: number,
        public readonly reactivationCount: number,
    ) {}
}
