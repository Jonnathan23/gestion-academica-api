export class CreateModuleDto {
    private constructor(
        public readonly mo_name: string,
        public readonly mo_description: string,
        public readonly mo_level: number,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreateModuleDto?] {
        const { mo_name, mo_description, mo_level } = object;
        let parsedMoLevel = mo_level;

        if (!mo_name) return ["Missing name"];
        if (!mo_description) return ["Missing description"];
        if (!mo_level) return ["Missing level"];

        if (typeof mo_level === "string") {
            parsedMoLevel = parseInt(mo_level);

            if (isNaN(parsedMoLevel)) {
                return ["Level must be a number"];
            }
        }

        if (parsedMoLevel < 1) return ["Level must be greater than 0"];
        if (parsedMoLevel > 6) return ["Level must be less than or equal to 6"];

        return [undefined, new CreateModuleDto(mo_name, mo_description, parsedMoLevel)];
    }
}
