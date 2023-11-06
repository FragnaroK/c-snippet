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
exports.saveSnippet = exports.convertSnippet = exports.parseSnippets = exports.getSnippets = void 0;
const utils_1 = __importDefault(require("../utils/utils"));
const converter_1 = __importDefault(require("../converter"));
const fileManager_1 = __importDefault(require("../utils/fileManager"));
const cson_parser_1 = __importDefault(require("cson-parser"));
const { isDir, isMultipleFile, isArray, parserVariables, getSnippetName, getFileExtension } = utils_1.default;
/**
 * Retrieves snippets from a directory or file.
 * @param {ParserType} editor - The editor type.
 * @param {string} path - Path to the snippets.
 * @returns Snippets data.
 */
function getSnippets(editor, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield isDir(path)) {
                if (isMultipleFile(editor)) {
                    const files = yield fileManager_1.default.getFiles(path);
                    const snippets = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () { return yield fileManager_1.default.readFile(file); })));
                    return [snippets, files, files.length];
                }
                else {
                    const snippets = yield fileManager_1.default.readFile(path);
                    const parsedSnippets = snippets.startsWith('{') ? Object.keys(JSON.parse(snippets)) : Object.keys(cson_parser_1.default.parse(snippets));
                    return [[snippets], parsedSnippets, parsedSnippets.length];
                }
            }
            throw new Error('Invalid directory or file');
        }
        catch (error) {
            throw new Error('Error while reading snippets' + error);
        }
    });
}
exports.getSnippets = getSnippets;
/**
 * Parses snippets using the specified editor.
 * @param {string} snippets - Snippets to parse.
 * @param {ParserType} editor - The editor type.
 * @returns Parsed snippets and converter instance.
 */
function parseSnippets(snippets, editor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const converter = new converter_1.default(isArray(snippets) ? snippets.join(parserVariables.divider) : snippets);
            const parsedSnippets = yield converter.parse(editor);
            return [parsedSnippets, converter];
        }
        catch (error) {
            throw new Error('Error while parsing snippets' + error);
        }
    });
}
exports.parseSnippets = parseSnippets;
/**
 * Converts snippets for multiple editors.
 * @param {Converter} converterInstance - Converter instance.
 * @param {ParsedSnippet[]} snippets - Parsed snippets.
 * @param {ParserType[]} editors - Editors to convert to.
 * @returns Converted snippets for each editor.
 */
function convertSnippet(converterInstance, snippets, editors) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const convertedSnippets = yield Promise.all(editors.map((editor) => __awaiter(this, void 0, void 0, function* () {
                return {
                    editor,
                    snippets: yield converterInstance.convert(snippets, editor)
                };
            })));
            return convertedSnippets;
        }
        catch (error) {
            throw new Error('Error while converting snippet' + error);
        }
    });
}
exports.convertSnippet = convertSnippet;
/**
 * Saves converted snippet to a file or directory.
 * @param {string} snippet - Snippet content.
 * @param {string} output - Output directory or file.
 * @param {ParserType} editor - The editor type.
 */
function saveSnippet(snippet, output, editor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let filesContent = [];
            if (isMultipleFile(editor)) {
                filesContent = snippet.split(parserVariables.divider).map((snip) => {
                    const { cleanName, filteredSnippet } = getSnippetName(snip);
                    return {
                        name: cleanName,
                        snippet: filteredSnippet
                    };
                });
                yield fileManager_1.default.writeFiles(filesContent.map((file) => ({
                    content: file.snippet,
                    filename: `${file.name}${getFileExtension(editor)}`,
                    filepath: output,
                    overwrite: true,
                })));
            }
            else {
                yield fileManager_1.default.writeFile({
                    content: snippet,
                    filename: `snippets${getFileExtension(editor)}`,
                    filepath: output,
                    overwrite: true,
                });
            }
        }
        catch (error) {
            throw new Error('Error while saving snippet' + error);
        }
    });
}
exports.saveSnippet = saveSnippet;
