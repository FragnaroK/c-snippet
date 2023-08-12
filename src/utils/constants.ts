import chalk from "chalk";
import { textSync } from "figlet";
import ora, { Color } from "ora";
import { aesthetic } from 'cli-spinners';
import logSymbols from "log-symbols";

export const THEME = {
    main: chalk.whiteBright,
    accent: {
        text: "cyan" as Color,
        fg: chalk.cyan,
        bg: chalk.bgCyanBright
    },
    dim: chalk.dim,
    error: chalk.redBright,
    success: chalk.greenBright,
    warning: chalk.yellowBright,
    info: chalk.blueBright,
    hidden: chalk.bgBlackBright,
}

export const spinner = ora({
    color: THEME.accent.text,
    spinner: aesthetic,
    hideCursor: true,
    text: 'Loading...',
});

const cliWidth = 69;

const lineWidth = (text: string): number => {
    const spacing = Math.floor(((cliWidth  / 2) + ((text.length + 2) / 2)));

    return spacing > 0 ? spacing : 10;
};

const Layout = {
    line: (blank: boolean = true, width: number = cliWidth) => `${blank ? '\n\n' : ''}${THEME.accent.bg.hidden(":".repeat(width))}${blank ? '\n\n' : ''}`,
    centeredText(text: string) {
        return `\n\n${" ".repeat(lineWidth(text))}${text}\n\n`;
    },
    centeredWithLine(text: string) {
        return `\n\n${this.line(false, lineWidth(text))} ${text} ${this.line(false, lineWidth(text))}\n\n`;
    }
}

export const _CLI = {
    banner: textSync('C-Snippet', { horizontalLayout: 'full', font: 'ANSI Shadow' }),
    initial_text() {
        return [
            Layout.line(),
            this.banner,
            Layout.centeredWithLine(chalk.underline('Convert your snippets between different editors')),
            `${THEME.dim(".".repeat(15))}Run ${THEME.main.bold("c-snippet -h")} for more${THEME.dim(".".repeat(15))}${THEME.dim("by @FragnaroK")}\n`, "=".repeat(68),
            "\n\n"
        ]
    },
    help() {},
    version() {},
    about() {},
    convert() {},
    listSnippets(snippets: string[], files: string[]) {
        const found = `${logSymbols.success} Found ${THEME.main.bold(snippets.length)} snippets in ${THEME.main.bold(files.length)} files`;
        return [ 
            Layout.centeredWithLine(chalk.underline('Snippets found')),
            Layout.centeredText(found),
            Layout.line(),
        ]
    },

};