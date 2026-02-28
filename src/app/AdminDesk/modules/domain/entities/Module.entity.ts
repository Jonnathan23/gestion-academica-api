
interface StudenModules {
    //TODO: cambiar por la entidad de student_module
 }

export class ModuleEntity {

    constructor(
        public mo_id: string,
        public mo_name: string,
        public mo_description: string,
        public mo_created_at: string,
        public mo_updated_at: string,
        private student_modules: StudenModules[], //TODO: cambiar por la entidad de student_module
    ) { }

}