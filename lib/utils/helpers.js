"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyHTML = exports.trimArray = exports.addKeysToObject = exports.errorHandler = exports.isArray = exports.getFileExtension = exports.getSnippetName = exports.isMultipleFile = exports.blank = exports.sleep = exports.escapeSpecialCharacters = exports.parserVariables = void 0;
const chalk_1 = __importDefault(require("chalk"));
const htmlparser2_1 = require("htmlparser2");
const constants_1 = require("./constants");
/**
 * Constants for parser variables.
 */
exports.parserVariables = {
    divider: '#{DIVIDER}',
    tabstop: '#{TABSTOP}',
    placeholder: '#{PLACEHOLDER}',
    escape: '#{ESCAPE}',
    comment: '#{COMMENT}',
    variable: '#{VARIABLE}',
    null: '#{NULL}',
    undefined: '#{UNDEFINED}',
    snippetName: {
        start: '#{NAME:',
        end: '}'
    },
};
/**
 * @param {string} input - The input string.
 * @param {number} times - The number of times to repeat the string.
 * @returns {string} - The escaped string.
 */
function escapeSpecialCharacters(input, times = 1) {
    let escapeText = input;
    for (let i = 0; i < times; i++) {
        escapeText = escapeText.replace(/[*+?^${}|[\]\\]/g, '\\$&');
    }
    return escapeText;
}
exports.escapeSpecialCharacters = escapeSpecialCharacters;
/**
 * Asynchronously sleeps for a given time in milliseconds.
 * @param ms - Time in milliseconds to sleep.
 */
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, ms));
    });
}
exports.sleep = sleep;
/**
 * Prints blank lines to the console.
 * @param lines - Number of blank lines to print (default is 1).
 */
const blank = (lines = 1) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.resolve(console.log('\n'.repeat(lines)));
});
exports.blank = blank;
/**
 * Checks if the editor is capable of handling multiple files.
 * @param editor - The editor type.
 * @returns Whether the editor supports multiple files.
 */
function isMultipleFile(editor) {
    return editor === "sublime" || editor === "dreamweaver";
}
exports.isMultipleFile = isMultipleFile;
/**
 * Extracts the snippet name from a snippet text.
 * @param snippet - The snippet text.
 * @returns Object containing the clean name and the filtered snippet.
 */
function getSnippetName(snippet) {
    const { start, end } = exports.parserVariables.snippetName;
    const regex = /#{NAME:\s*(.*?)\s*}/;
    const match = regex.exec(snippet);
    const name = match && match[1] ? match[1] : "No Name";
    const filteredSnippet = snippet.replace(`${start}${name}${end}`, "");
    const cleanName = name.trim().replace(/\s/g, "-");
    return { cleanName, filteredSnippet };
}
exports.getSnippetName = getSnippetName;
/**
 * Retrieves the file extension based on the editor type.
 * @param editor - The editor type.
 * @returns The file extension.
 */
function getFileExtension(editor) {
    switch (editor) {
        case 'vscode': return ".code-snippets";
        case 'sublime': return ".sublime-snippet";
        case 'atom': return ".cson";
        case 'dreamweaver': return ".csn";
        default: return "";
    }
}
exports.getFileExtension = getFileExtension;
/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array.
 */
const isArray = (value) => Array.isArray(value);
exports.isArray = isArray;
/**
 * Handles errors by logging them to the console and exiting the process.
 * @param error - The error object.
 * @param msg - Optional error message.
 */
function errorHandler(error, msg) {
    var _a;
    const regex = /(error:|Error:)/g;
    const parsedErrorStack = (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split(regex).map((item, i) => `${chalk_1.default.dim(".".repeat(i))}${chalk_1.default.dim(item.trim())}`).join("\n");
    console.error(msg !== null && msg !== void 0 ? msg : "❌ ERROR", `\n${'🔻'.repeat(constants_1._CLI.width / 2)}\n`, chalk_1.default.redBright(error.message ? `\n${error.message}` : "No error message available"), parsedErrorStack ? `\n${parsedErrorStack}` : "No stack trace available");
    process.exit(1);
}
exports.errorHandler = errorHandler;
/**
 * Adds keys from an array of objects to a target object.
 * @param data - An array of objects.
 * @param target - The target object.
 * @returns The target object with the keys added.
 */
function addKeysToObject(data, target) {
    data.forEach((item) => {
        for (const key in item) {
            if (key in target) {
                target[key] = Object.assign(Object.assign({}, target[key]), item[key]);
            }
            else {
                target[key] = Object.assign({}, item[key]);
            }
        }
    });
    return target;
}
exports.addKeysToObject = addKeysToObject;
/**
 * Trims an array of strings.
 * @param array - An array of strings.
 * @param deep - Whether to perform deep trimming (removing tabs).
 * @returns An array of trimmed strings.
 */
function trimArray(array, deep) {
    const spacesRegexp = /^\s*$/;
    const trimmedArray = array.map((item) => item.trim()).filter((item) => item !== "" && !spacesRegexp.test(item));
    return trimmedArray;
}
exports.trimArray = trimArray;
/**
 * Prettifies an HTML string.
 * @param html - An HTML string.
 * @returns A prettified HTML string.
 */
function prettifyHTML(html) {
    let output = '';
    let indentLevel = 1;
    const parser = new htmlparser2_1.Parser({
        onopentag(name, attribs) {
            indentLevel++;
            output += `${'\t'.repeat(indentLevel)}<${name}`;
            for (const key in attribs) {
                output += ` ${key}="${attribs[key]}"`;
            }
            if (name === 'br') {
                output += '\n';
            }
            else if (name === 'pre' || name === 'code') {
                indentLevel = 0;
            }
            else if (name === 'p') {
                output += '>';
            }
            else {
                output += '>\n';
            }
        },
        ontext(text) {
            indentLevel++;
            output += text.trim();
        },
        onclosetag(tagname) {
            indentLevel--;
            if (tagname === 'pre' || tagname === 'code') {
                indentLevel = 1;
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;
            }
            else if (tagname === 'p') {
                output += `</${tagname}>\n`;
            }
            else {
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;
            }
        },
    }, { decodeEntities: true });
    parser.write(html);
    parser.end();
    return output.trim();
}
exports.prettifyHTML = prettifyHTML;
exports.default = {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parserVariables: exports.parserVariables,
    sleep,
    isMultipleFile,
    errorHandler,
    isArray: exports.isArray,
    blank: exports.blank,
    getSnippetName,
    getFileExtension,
    escapeSpecialCharacters,
};
