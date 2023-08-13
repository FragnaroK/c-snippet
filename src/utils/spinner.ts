import chalk from "chalk";
import ora from "ora";
import { THEME } from "./constants";

const _vscode = {
    frames: [
        chalk.bgBlueBright.white("V      "),
        chalk.bgBlueBright.white("VS     "),
        chalk.bgBlueBright.white("VSC    "),
        chalk.bgBlueBright.white("VSCO   "),
        chalk.bgBlueBright.white("VSCOD  "),
        chalk.bgBlueBright.white("VSCODE "),
    ],
    interval: 80
}

const _sublime = {
    frames: [
        chalk.bgYellowBright.black("S      "),
        chalk.bgYellowBright.black("SU     "),
        chalk.bgYellowBright.black("SUB    "),
        chalk.bgYellowBright.black("SUBL   "),
        chalk.bgYellowBright.black("SUBLIM "),
        chalk.bgYellowBright.black("SUBLIME"),
    ],
    interval: 80
}

const _atom = {
    frames: [
        chalk.bgGreenBright.black("A      "),
        chalk.bgGreenBright.black("AT     "),
        chalk.bgGreenBright.black("ATO    "),
        chalk.bgGreenBright.black("ATOM   "),
    ],
    interval: 80
}

const _dreamweaver = {
    frames: [
        chalk.bgMagentaBright.white("D      "),
        chalk.bgMagentaBright.white("DR     "),
        chalk.bgMagentaBright.white("DRE    "),
        chalk.bgMagentaBright.white("DREAM  "),
        chalk.bgMagentaBright.white("DREAMW "),
        chalk.bgMagentaBright.white("DREAMWV"),
    ],
    interval: 80
}

export const spinner = ora({
    color: THEME.accent.text,
    spinner: {
        frames: [
            ..._vscode.frames,
            ..._sublime.frames,
            ..._atom.frames,
            ..._dreamweaver.frames,
        ],
        interval: 100
    },
    hideCursor: true,
    text: 'Loading...',
});