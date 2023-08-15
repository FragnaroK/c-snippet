"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const constants_1 = require("./constants");
const _vscode = {
    frames: [
        chalk_1.default.bgBlueBright.white("V      "),
        chalk_1.default.bgBlueBright.white("VS     "),
        chalk_1.default.bgBlueBright.white("VSC    "),
        chalk_1.default.bgBlueBright.white("VSCO   "),
        chalk_1.default.bgBlueBright.white("VSCOD  "),
        chalk_1.default.bgBlueBright.white("VSCODE "),
    ],
    interval: 80
};
const _sublime = {
    frames: [
        chalk_1.default.bgYellowBright.black("S      "),
        chalk_1.default.bgYellowBright.black("SU     "),
        chalk_1.default.bgYellowBright.black("SUB    "),
        chalk_1.default.bgYellowBright.black("SUBL   "),
        chalk_1.default.bgYellowBright.black("SUBLIM "),
        chalk_1.default.bgYellowBright.black("SUBLIME"),
    ],
    interval: 80
};
const _atom = {
    frames: [
        chalk_1.default.bgGreenBright.black("A      "),
        chalk_1.default.bgGreenBright.black("AT     "),
        chalk_1.default.bgGreenBright.black("ATO    "),
        chalk_1.default.bgGreenBright.black("ATOM   "),
    ],
    interval: 80
};
const _dreamweaver = {
    frames: [
        chalk_1.default.bgMagentaBright.white("D      "),
        chalk_1.default.bgMagentaBright.white("DR     "),
        chalk_1.default.bgMagentaBright.white("DRE    "),
        chalk_1.default.bgMagentaBright.white("DREAM  "),
        chalk_1.default.bgMagentaBright.white("DREAMW "),
        chalk_1.default.bgMagentaBright.white("DREAMWV"),
    ],
    interval: 80
};
exports.spinner = (0, ora_1.default)({
    color: constants_1.THEME.accent.text,
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
