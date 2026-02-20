import colors from "colors";

export class ColorsAdapter {

    //* Bold Colors
    static setBlueBold(text: string): string {
        return colors.blue.bold(text);
    }

    static setCyanBold(text: string): string {
        return colors.cyan.bold(text);
    }

    static setRedBold(text: string): string {
        return colors.red.bold(text);
    }

    static setGreenBold(text: string): string {
        return colors.green.bold(text);
    }

    static setYellowBold(text: string): string {
        return colors.yellow.bold(text);
    }

    static setMagentaBold(text: string): string {
        return colors.magenta.bold(text);
    }

    //* Normal Colors
    static setCyan(text: string): string {
        return colors.cyan(text);
    }

    static setRed(text: string): string {
        return colors.red(text);
    }

    static setGreen(text: string): string {
        return colors.green(text);
    }

    static setYellow(text: string): string {
        return colors.yellow(text);
    }

    static setMagenta(text: string): string {
        return colors.magenta(text);
    }

}