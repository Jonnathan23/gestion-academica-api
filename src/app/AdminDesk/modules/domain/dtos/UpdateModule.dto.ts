export class UpdateModuleDto {

    private constructor(
        public readonly mo_name?: string,
        public readonly mo_description?: string
    ) { }

    get values() {
        const returnObject: { [key: string]: any } = {};
        if(this.mo_name) returnObject.mo_name = this.mo_name;
        if(this.mo_description) returnObject.mo_description = this.mo_description;
        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateModuleDto?] {
        const { mo_name, mo_description } = object;

        if(!mo_name && !mo_description) return ['Missing fields'];        
        
        return [undefined, new UpdateModuleDto(mo_name, mo_description)];

    }
}