export class UpdateRetentionAlertDto {
    private constructor(
        public readonly hasResponded: boolean,
        public readonly isJustified: boolean,
        public readonly observations: string,
        public readonly contactDate?: Date,
        public readonly justificationReason?: string,
        public readonly returnDeadline?: Date,
    ) {}

    public static create(props: { [key: string]: any }): [string?, UpdateRetentionAlertDto?] {
        const { hasResponded, isJustified, observations, contactDate, justificationReason, returnDeadline } = props;

        if (hasResponded === undefined || typeof hasResponded !== "boolean") {
            return ["Invalid 'hasResponded' property"];
        }

        if (isJustified === undefined || typeof isJustified !== "boolean") {
            return ["Invalid 'isJustified' property"];
        }

        if (observations === undefined || typeof observations !== "string") {
            return ["Invalid 'observations' property"];
        }

        if (isJustified && (!justificationReason || typeof justificationReason !== "string")) {
            return ["'justificationReason' is required when 'isJustified' is true"];
        }

        let parsedContactDate: Date | undefined = undefined;

        if (contactDate) {
            parsedContactDate = new Date(contactDate);
            if (isNaN(parsedContactDate.getTime())) {
                return ["Invalid 'contactDate' format"];
            }
        }

        let parsedReturnDeadline: Date | undefined = undefined;

        if (returnDeadline) {
            parsedReturnDeadline = new Date(returnDeadline);
            if (isNaN(parsedReturnDeadline.getTime())) {
                return ["Invalid 'returnDeadline' format"];
            }
        }

        return [
            undefined,
            new UpdateRetentionAlertDto(
                hasResponded,
                isJustified,
                observations,
                parsedContactDate,
                justificationReason,
                parsedReturnDeadline,
            ),
        ];
    }
}
