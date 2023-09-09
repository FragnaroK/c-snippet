"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const cli_spinners_1 = require("cli-spinners");
const constants_1 = require("./constants");
const maxWordLength = 6;
const loaders = new Map([
    ["atom", "ATOM   "],
    ["vscode", "VSCODE "],
    ["sublime", "SUBLIME"],
    ["dreamweaver", "DREAMWV"],
]);
function getLoaderFrames(parser) {
    const loader = loaders.get(parser);
    if (!loader)
        return [];
    return loader.split("").map((letter, i, letters) => chalk_1.default.bgBlueBright.white(letters.slice(0, i).join("") + " ".repeat(maxWordLength - i)));
}
const _vscode = {
    frames: (_a = getLoaderFrames("vscode")) !== null && _a !== void 0 ? _a : [],
    interval: 80
};
const _sublime = {
    frames: (_b = getLoaderFrames("sublime")) !== null && _b !== void 0 ? _b : [],
    interval: 80
};
const _atom = {
    frames: (_c = getLoaderFrames("atom")) !== null && _c !== void 0 ? _c : [],
    interval: 80
};
const _dreamweaver = {
    frames: (_d = getLoaderFrames("dreamweaver")) !== null && _d !== void 0 ? _d : [],
    interval: 80
};
exports.spinner = (0, ora_1.default)({
    color: constants_1.THEME.accent.text,
    spinner: {
        // frames: [
        //     ..._vscode.frames,
        //     ..._sublime.frames,
        //     ..._atom.frames,
        //     ..._dreamweaver.frames,
        // ],
        frames: cli_spinners_1.dots.frames,
        interval: 100
    },
    hideCursor: true,
    text: 'Loading...',
});
