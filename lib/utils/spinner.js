"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinner = void 0;
const ora_1 = __importDefault(require("ora"));
const cli_spinners_1 = require("cli-spinners");
const constants_1 = require("./constants");
exports.spinner = (0, ora_1.default)({
    color: constants_1.THEME.accent.text,
    spinner: {
        frames: cli_spinners_1.dots.frames,
        interval: 100
    },
    hideCursor: true,
    text: 'Loading...',
});
