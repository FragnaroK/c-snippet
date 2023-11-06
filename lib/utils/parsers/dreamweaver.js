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
const xml2js_1 = require("xml2js");
const fs_1 = require("fs");
const helpers_1 = require("../helpers");
/**
 * Represents a utility class for working with Dreamweaver snippets.
 */
class Dreamweaver {
    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     *
     */
    static isSnippet(filePathOrString) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCSN = yield Promise.resolve(filePathOrString.endsWith('.csn'));
            const isCorrectFormat = yield Dreamweaver.parse(filePathOrString).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);
            return yield Promise.all([isCSN, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
    /**
     * Parses a Dreamweaver snippet XML file and returns a parsed snippet object.
     * @param filePath - The path to the Dreamweaver snippet XML file.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error reading the file or parsing the Dreamweaver snippet XML.
     */
    static parseFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = (0, fs_1.readFileSync)(filePath, 'utf-8');
                return Dreamweaver.parse(data);
            }
            catch (err) {
                throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
            }
        });
    }
    /**
     * Parses a Dreamweaver snippet XML string and returns a parsed snippet object.
     * @param snippet - The Dreamweaver snippet XML string.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error parsing the Dreamweaver snippet XML.
     */
    static parse(snippet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parser = new xml2js_1.Parser();
                const parsedSnippet = { body: [], scope: '' };
                parser.parseString(snippet, (err, res) => {
                    var _a;
                    const result = res;
                    const snippetElement = result.snippet;
                    parsedSnippet.name = snippetElement.$.name;
                    parsedSnippet.description = snippetElement.$.description;
                    parsedSnippet.prefix = snippetElement.$.preview;
                    for (const insertText of (_a = snippetElement.insertText) !== null && _a !== void 0 ? _a : []) {
                        if (insertText._) {
                            parsedSnippet.body = (0, helpers_1.trimArray)(insertText._.split('\n'));
                        }
                    }
                    if (err) {
                        throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
                    }
                });
                return parsedSnippet;
            }
            catch (err) {
                throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
            }
        });
    }
    /**
     * Converts a parsed snippet object into a Dreamweaver snippet XML string.
     * @param snippet - A parsed snippet object.
     * @returns A Dreamweaver snippet XML string.
     */
    static stringify(snippet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const builder = new xml2js_1.Builder({
                    renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
                    cdata: true,
                    xmldec: { 'version': '1.0', 'encoding': 'utf-8' },
                });
                const { name, description, prefix, body } = snippet;
                // <FORCEDATA> is a workaround to force xml2js to render CDATA
                // ? Could be improved by using a custom render function
                const insertTextElements = {
                    snippet: {
                        $: {
                            name,
                            description,
                            preview: prefix,
                            type: 'block'
                        },
                        insertText: [
                            {
                                $: {
                                    location: 'beforeSelection'
                                },
                                _: `<FORCEDATA>\n${(0, helpers_1.escapeSpecialCharacters)((0, helpers_1.prettifyHTML)((0, helpers_1.isArray)(body) ? body.join('\n') : body))}\n</FORCEDATA>`
                            },
                            {
                                $: {
                                    location: 'afterSelection'
                                },
                                _: '#{NULL}'
                            }
                        ]
                    }
                };
                const snippetOBJ = builder.buildObject(insertTextElements)
                    .replace(/#{\s*NULL\s*}/g, "")
                    .replace("<![CDATA[", "\n<![CDATA[\n")
                    .replace("]]>", "\n]]>\n")
                    .replace(/<FORCEDATA>\n/g, "")
                    .replace(/\n<\/FORCEDATA>/g, "");
                return `#{NAME:${name}}${snippetOBJ}`;
            }
            catch (err) {
                throw new Error('Failed to convert parsed snippet to Dreamweaver snippet XML: ' + err.message);
            }
        });
    }
}
exports.default = Dreamweaver;
