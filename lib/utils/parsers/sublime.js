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
class Sublime {
    static isSnippet(filePathOrString, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSublime = yield Promise.resolve(filePathOrString.endsWith('.sublime-snippet'));
            const isCorrectFormat = yield Sublime.parse(filePathOrString, name).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);
            return yield Promise.all([isSublime, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
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
                const xmlObject = {
                    snippet: {
                        content: {
                            _: (0, helpers_1.prettifyHTML)(body.join('')),
                            $: {}
                        }
                    }
                };
                xmlObject.snippet.tabTrigger = prefix !== null && prefix !== void 0 ? prefix : "";
                xmlObject.snippet.description = description !== null && description !== void 0 ? description : "No description provided";
                xmlObject.snippet.scope = "#{NULL}";
                const snippetOBJ = (builder.buildObject(xmlObject))
                    .replace(/#{\s*NULL\s*}/g, "")
                    .replace("CDATA[", "CDATA[\n");
                return `#{NAME:${name}}${snippetOBJ}`;
            }
            catch (error) {
                throw new Error(`Error converting parsed snippet to Sublime Text snippet: ${error.message}`);
            }
        });
    }
}
exports.default = Sublime;
