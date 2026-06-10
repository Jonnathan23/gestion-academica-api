export interface TimelineStudentInfo {
    id: string;
    fullName: string;
    phoneNumber: string;
    startDate: Date;
}

export interface TimelineModuleInfo {
    moduleId: string;
    name: string;
    level: number;
}

export interface TimelineEnrolledLevel {
    contractId: string;
    status: string;
    purchaseDate: Date;
    module: TimelineModuleInfo;
}

export interface TimelineAvailableModule {
    moduleId: string;
    name: string;
    level: number;
    description: string;
}

export class StudentTimelineProjection {
    constructor(
        public readonly studentInfo: TimelineStudentInfo,
        public readonly enrolledLevels: TimelineEnrolledLevel[],
        public readonly availableModules: TimelineAvailableModule[],
    ) {}
}
