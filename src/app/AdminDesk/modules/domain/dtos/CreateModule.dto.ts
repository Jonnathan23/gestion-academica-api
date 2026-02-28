

export class CreateModuleDto {

    private constructor(
        public readonly mo_name: string,
        public readonly mo_description: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateModuleDto?] {
        const { mo_name, mo_description } = object;


        if(!mo_name) return ['Missing name'];
        if(!mo_description) return ['Missing description'];
        
        return [undefined, new CreateModuleDto(mo_name, mo_description)];

    }
}