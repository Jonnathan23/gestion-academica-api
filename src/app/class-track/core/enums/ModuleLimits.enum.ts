export const moduleLimitsDictionary = {
    A1: 12,
    A2: 26,
    B1: 40,
    B2: 56,
    C1: 68,
    C2: 82,
} as const;

export type ModuleLimits = keyof typeof moduleLimitsDictionary;

export const MIN_MAX_LESSONS_MODULE = [
    {
        name: "A1",
        level: 1,
        minLesson: 1,
        maxLesson: 12,
    },
    {
        name: "A2",
        level: 2,
        minLesson: 13,
        maxLesson: 26,
    },
    {
        name: "B1",
        level: 3,
        minLesson: 27,
        maxLesson: 40,
    },
    {
        name: "B2",
        level: 4,
        minLesson: 41,
        maxLesson: 56,
    },
    {
        name: "C1",
        level: 5,
        minLesson: 57,
        maxLesson: 68,
    },
    {
        name: "C2",
        level: 6,
        minLesson: 69,
        maxLesson: 82,
    },
] as const;

export type MinMaxLessonsModule = typeof MIN_MAX_LESSONS_MODULE;
