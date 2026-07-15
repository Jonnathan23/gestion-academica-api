export interface EntityValidator<TExpectedData> {
    validate(rawData: unknown): TExpectedData;
}
