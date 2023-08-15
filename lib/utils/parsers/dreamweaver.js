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
class Dreamweaver {
    static isSnippet(filePathOrString) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCSN = yield Promise.resolve(filePathOrString.endsWith('.csn'));
            const isCorrectFormat = yield Dreamweaver.parse(filePathOrString).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);
            return yield Promise.all([isCSN, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
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
    static stringify(snippet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const builder = new xml2js_1.Builder({
                    renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
                    cdata: true,
                    xmldec: { 'version': '1.0', 'encoding': 'utf-8' },
                });
                const { name, description, prefix, body } = snippet;
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
                                _: (0, helpers_1.prettifyHTML)(body.join(''))
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
                    .replace("]]>", "\n]]>\n");
                return `#{NAME:${name}}${snippetOBJ}`;
            }
            catch (err) {
                throw new Error('Failed to convert parsed snippet to Dreamweaver snippet XML: ' + err.message);
            }
        });
    }
}
exports.default = Dreamweaver;
