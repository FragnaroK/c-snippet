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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyHTML = exports.trimArray = exports.addKeysToObject = exports.errorHandler = exports.isArray = exports.getFileExtension = exports.getSnippetName = exports.isMultipleFile = exports.blank = exports.sleep = exports.parser_variables = void 0;
const htmlparser2_1 = require("htmlparser2");
exports.parser_variables = {
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
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    });
}
exports.sleep = sleep;
const blank = (lines = 1) => __awaiter(void 0, void 0, void 0, function* () { return Promise.resolve(console.log('\n'.repeat(lines))); });
exports.blank = blank;
function isMultipleFile(editor) {
    if (editor === "sublime" || editor === "dreamweaver")
        return true;
    return false;
}
exports.isMultipleFile = isMultipleFile;
function getSnippetName(snippet) {
    const { start, end } = exports.parser_variables.snippetName;
    const regex = /#{NAME:\s*(.*?)\s*}/;
    const match = regex.exec(snippet);
    const name = match && match[1] ? match[1] : "No Name";
    const filteredSnippet = snippet.replace(`${start}${name}${end}`, "");
    const cleanName = name.trim().replace(/\s/g, "-");
    return { cleanName, filteredSnippet };
}
exports.getSnippetName = getSnippetName;
function getFileExtension(editor) {
    switch (editor) {
        case 'vscode': return ".code-snippets";
        case 'sublime': return ".sublime-snippet";
        case 'atom': return ".cson";
        case 'dreamweaver': return ".csn";
    }
}
exports.getFileExtension = getFileExtension;
const isArray = (value) => Array.isArray(value);
exports.isArray = isArray;
function errorHandler(error, msg) {
    console.error(msg !== null && msg !== void 0 ? msg : "", error);
    process.exit(1);
}
exports.errorHandler = errorHandler;
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
function trimArray(array, deep = false) {
    if (!deep)
        return array.map((line) => line.trim()).filter((item) => item !== '');
    return array.map((line) => line.trim()).filter((item) => item !== '').map((line) => {
        return line.split('').filter((char) => char !== '\t').join('');
    });
}
exports.trimArray = trimArray;
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
            else if (name === 'pre') {
                indentLevel = 0;
            }
            else if (name === 'code') {
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
    return output;
}
exports.prettifyHTML = prettifyHTML;
exports.default = {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parser_variables: exports.parser_variables,
    sleep,
    isMultipleFile,
    errorHandler,
    isArray: exports.isArray,
    blank: exports.blank,
    getSnippetName,
    getFileExtension
};
