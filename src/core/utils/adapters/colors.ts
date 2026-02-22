import colors from "colors";

export const ColorsAdapter = {

    //* Bold Colors
    setBlueBold(text: string): string {
        return colors.blue.bold(text);
    },

    setCyanBold(text: string): string {
        return colors.cyan.bold(text);
    },

    setRedBold(text: string): string {
        return colors.red.bold(text);
    },

    setGreenBold(text: string): string {
        return colors.green.bold(text);
    },

    setYellowBold(text: string): string {
        return colors.yellow.bold(text);
    },

    setMagentaBold(text: string): string {
        return colors.magenta.bold(text);
    },

    //* Normal Colors
    setCyan(text: string): string {
        return colors.cyan(text);
    },

    setRed(text: string): string {
        return colors.red(text);
    },

    setGreen(text: string): string {
        return colors.green(text);
    },

    setYellow(text: string): string {
        return colors.yellow(text);
    },

    setMagenta(text: string): string {
        return colors.magenta(text);
    }

}