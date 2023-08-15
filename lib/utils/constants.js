"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._CLI = exports.THEME = void 0;
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = require("figlet");
const log_symbols_1 = __importDefault(require("log-symbols"));
exports.THEME = {
    main: chalk_1.default.whiteBright,
    accent: {
        text: "cyan",
        fg: chalk_1.default.cyan,
        bg: chalk_1.default.bgCyanBright
    },
    dim: chalk_1.default.dim,
    error: chalk_1.default.redBright,
    success: chalk_1.default.greenBright,
    warning: chalk_1.default.yellowBright,
    info: chalk_1.default.blueBright,
    hidden: chalk_1.default.bgBlackBright,
};
const cliWidth = 69;
const lineWidth = (text) => {
    const spacing = Math.floor(((cliWidth / 1.75) - ((text.length + 2) / 2)));
    return spacing > 0 ? spacing : 10;
};
const Layout = {
    line: (blank = true, width = cliWidth) => `${blank ? '\n\n' : ''}${exports.THEME.accent.bg.hidden(":".repeat(width))}${blank ? '\n\n' : ''}`,
    indentedText: (text, options) => `${options.blank ? '\n\n' : ''}${" ".repeat(5)} ${options.dim ? chalk_1.default.dim(text) : text} ${options.blank ? '\n\n' : ''}`,
    centeredWithLine(text) {
        return `\n\n${this.line(false, lineWidth(text))} ${text} ${this.line(false, lineWidth(text))}\n\n`;
    }
};
exports._CLI = {
    banner: (0, figlet_1.textSync)('C-Snippet', { horizontalLayout: 'full', font: 'ANSI Shadow' }),
    layout: Layout,
    initial_text() {
        return [
            Layout.line(),
            this.banner,
            Layout.centeredWithLine(chalk_1.default.underline('Convert your snippets between different editors')),
            `${exports.THEME.dim(".".repeat(15))}Run ${exports.THEME.main.bold("c-snippet -h")} for more${exports.THEME.dim(".".repeat(15))}${exports.THEME.dim("by @FragnaroK")}\n`, "=".repeat(68),
            "\n\n"
        ];
    },
    help() { },
    version() { },
    listSnippets(files, count) {
        return [
            Layout.indentedText(`${log_symbols_1.default.success} Found ${exports.THEME.main.bold(count)} snippets in ${exports.THEME.main.bold(files.length)} files`, {
                blank: false,
                dim: true
            }),
        ];
    },
};
