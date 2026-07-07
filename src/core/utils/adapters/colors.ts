import colors from "colors";

export class ColorsAdapter {
    //* Bold Colors
    public static setBlueBold(text: string): string {
        return colors.blue.bold(text);
    }

    public static setCyanBold(text: string): string {
        return colors.cyan.bold(text);
    }

    public static setRedBold(text: string): string {
        return colors.red.bold(text);
    }

    public static setGreenBold(text: string): string {
        return colors.green.bold(text);
    }

    public static setYellowBold(text: string): string {
        return colors.yellow.bold(text);
    }

    public static setMagentaBold(text: string): string {
        return colors.magenta.bold(text);
    }

    //* Normal Colors
    public static setCyan(text: string): string {
        return colors.cyan(text);
    }

    public static setRed(text: string): string {
        return colors.red(text);
    }

    public static setGreen(text: string): string {
        return colors.green(text);
    }

    public static setYellow(text: string): string {
        return colors.yellow(text);
    }

    public static setMagenta(text: string): string {
        return colors.magenta(text);
    }
}
