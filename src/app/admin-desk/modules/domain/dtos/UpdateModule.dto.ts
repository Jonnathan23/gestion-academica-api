export class UpdateModuleDto {
    private constructor(
        public readonly mo_name?: string,
        public readonly mo_description?: string,
        public readonly mo_level?: number,
    ) {}

    public get values() {
        const returnObject: { [key: string]: any } = {};

        if (this.mo_name) returnObject.mo_name = this.mo_name;
        if (this.mo_description) returnObject.mo_description = this.mo_description;
        if (this.mo_level) returnObject.mo_level = this.mo_level;

        return returnObject;
    }

    public static create(object: { [key: string]: any }): [string?, UpdateModuleDto?] {
        const { mo_name, mo_description, mo_level } = object;

        if (!mo_name && !mo_description && !mo_level) return ["Missing fields"];

        if (mo_level && mo_level < 1) return ["Level must be greater than 0"];
        if (mo_level && mo_level > 6) return ["Level must be less than or equal to 6"];

        return [undefined, new UpdateModuleDto(mo_name, mo_description, mo_level)];
    }
}
