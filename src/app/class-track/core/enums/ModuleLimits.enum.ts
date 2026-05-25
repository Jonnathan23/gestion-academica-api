export const moduleLimitsDictionary: Record<string, number> = {
    A1: 12,
    A2: 26,
    B1: 40,
    B2: 56,
    C1: 68,
    C2: 82,
} as const;

export type ModuleLimits = keyof typeof moduleLimitsDictionary;
