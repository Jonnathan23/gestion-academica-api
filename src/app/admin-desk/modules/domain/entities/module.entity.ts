export class ModuleEntity {
    public constructor(
        public mo_id: string,
        public mo_name: string,
        public mo_description: string,
        public mo_level: number,
        public mo_created_at: string,
        public mo_updated_at: string,
    ) {}
}
