import chalk from "chalk";
import { textSync } from "figlet";
import { Color } from "ora";
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

export const available_editors = ["vscode", "sublime", "atom", "dreamweaver"];

const cliWidth = 69 ;

const lineWidth = (text: string): number => {
    const spacing = Math.floor(((cliWidth / 1.75) - ((text.length + 2) / 2)));
    return spacing > 0 ? spacing : 10;
};

const Layout = {
    line: (blank: boolean = true, width: number = cliWidth) => `${blank ? '\n\n' : ''}${THEME.accent.bg.hidden(":".repeat(width))}${blank ? '\n\n' : ''}`,
    indentedText: (text: string, options: {
        blank?: boolean,
        dim?: boolean
    }) => `${options.blank ? '\n\n' : ''}${" ".repeat(5)} ${options.dim ? chalk.dim(text) : text} ${options.blank ? '\n\n' : ''}`,
    centeredWithLine(text: string) {
        return `\n\n${this.line(false, lineWidth(text))} ${text} ${this.line(false, lineWidth(text))}\n\n`;
    }
}

export const _CLI = {
    width: cliWidth,
    banner: textSync('C-Snippet', { horizontalLayout: 'full', font: 'ANSI Shadow' }),
    layout: Layout,
    initial_text() {
        return [
            Layout.line(),
            this.banner,
            Layout.centeredWithLine(chalk.underline('Convert your snippets between different editors')),
            `${THEME.dim(".".repeat(15))}Run ${THEME.main.bold("c-snippet -h")} for more${THEME.dim(".".repeat(15))}${THEME.dim("by @FragnaroK")}\n`, "=".repeat(68),
            "\n\n"
        ]
    },
    // help() {},
    // version() {},
    listSnippets(files: string[], count: number) {
        return [
            // Layout.centeredWithLine(chalk.underline('Snippets found')),
            Layout.indentedText(`${logSymbols.success} Found ${THEME.main.bold(count)} snippets in ${THEME.main.bold(files.length)} files`, {
                blank: false,
                dim: true
            }),
            // Layout.line(),
        ]
    },

};