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
const promises_1 = require("fs/promises");
const xml2js_1 = require("xml2js");
const helpers_1 = require("../helpers");
/**
 * A utility class for parsing and stringifying Sublime Text snippets.
 */
class Sublime {
    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     *
     */
    static isSnippet(filePathOrString, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSublime = yield Promise.resolve(filePathOrString.endsWith('.sublime-snippet'));
            const isCorrectFormat = yield Sublime.parse(filePathOrString, name).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);
            return yield Promise.all([isSublime, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
    /**
     * Parses a Sublime Text snippet file asynchronously and returns a parsed snippet object.
     * @param {string} snippetPath - The path to the Sublime Text snippet file.
     * @returns {Promise<ParsedSnippet>} - A promise that resolves to the parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue reading or parsing the snippet file.
     */
    static parseFile(snippetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, promises_1.readFile)(snippetPath, 'utf-8');
                return Sublime.parse(data, snippetPath.slice(snippetPath.lastIndexOf('/') + 1));
            }
            catch (error) {
                throw new Error(`Error parsing Sublime Text snippet: ${error.message}`);
            }
        });
    }
    /**
     * Parses a Sublime Text snippet string and returns a parsed snippet object.
     * @param {string} snippet - The Sublime Text snippet string.
     * @returns {ParsedSnippet} - The parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue parsing the snippet string.
     */
    static parse(snippet, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parser = new xml2js_1.Parser();
                const parsedSnippet = { body: [], scope: '' };
                parser.parseString(snippet, (err, res) => {
                    var _a;
                    if (err) {
                        throw new Error(`Error parsing Sublime Text snippet: ${err.message}`);
                    }
                    const snippetElement = res.snippet;
                    parsedSnippet.name = name;
                    parsedSnippet.description = snippetElement.description[0];
                    parsedSnippet.prefix = snippetElement.tabTrigger[0];
                    parsedSnippet.body = (0, helpers_1.trimArray)((_a = snippetElement.content) === null || _a === void 0 ? void 0 : _a[0].split('\n')) || [];
                    parsedSnippet.scope = snippetElement.scope[0];
                });
                return parsedSnippet;
            }
            catch (error) {
                throw new Error(`Error parsing Sublime Text snippet: ${error.message}`);
            }
        });
    }
    /**
     * Converts a parsed snippet object to a formatted XML string for Sublime Text.
     * @param {ParsedSnippet} parsedSnippet - The parsed snippet object to be converted.
     * @returns {string} - A formatted XML string representing the Sublime Text snippet.
     * @throws {Error} - Throws an error if there's an issue converting the parsed snippet object.
     * @see {@link https://www.sublimetext.com/docs/3/snippets.html|Sublime Text Snippets}
     *
     */
    static stringify(parsedSnippet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const builder = new xml2js_1.Builder({
                    headless: true,
                    renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
                    cdata: true,
                    xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },
                });
                const { body, prefix, description, name } = parsedSnippet;
                // <FORCEDATA> is a workaround to force xml2js to render CDATA
                // ? Could be improved by using a custom render function
                const xmlObject = {
                    snippet: {
                        content: {
                            _: `<FORCEDATA>\n${(0, helpers_1.escapeSpecialCharacters)((0, helpers_1.prettifyHTML)((0, helpers_1.isArray)(body) ? body.join('\n') : body))}\n</FORCEDATA>`,
                            $: {}
                        }
                    }
                };
                xmlObject.snippet.tabTrigger = prefix !== null && prefix !== void 0 ? prefix : "";
                xmlObject.snippet.description = description !== null && description !== void 0 ? description : "No description provided";
                xmlObject.snippet.scope = "#{NULL}";
                const snippetOBJ = (builder.buildObject(xmlObject))
                    .replace(/#{\s*NULL\s*}/g, "")
                    .replace("CDATA[", "CDATA[\n")
                    .replace("]]>", "\n]]>")
                    .replace(/<FORCEDATA>\n/g, "")
                    .replace(/\n<\/FORCEDATA>/g, "");
                return `#{NAME:${name}}${snippetOBJ}`;
            }
            catch (error) {
                throw new Error(`Error converting parsed snippet to Sublime XML snippet: ${error.message}`);
            }
        });
    }
}
exports.default = Sublime;
