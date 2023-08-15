"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = __importDefault(require("./atom"));
const dreamweaver_1 = __importDefault(require("./dreamweaver"));
const vscode_1 = __importDefault(require("./vscode"));
const sublime_1 = __importDefault(require("./sublime"));
const Parsers = {
    ATOM: atom_1.default,
    DREAMWEAVER: dreamweaver_1.default,
    VSCODE: vscode_1.default,
    SUBLIME: sublime_1.default
};
exports.default = Parsers;
