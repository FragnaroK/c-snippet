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
const cson_parser_1 = require("cson-parser");
const helpers_1 = require("../helpers");
class Atom {
    static getSources(parsedCSON) {
        return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
    }
    static parseParsedCSON(parsedCSON, sources) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedSnippets = [];
                sources.forEach((source) => {
                    const snippets = parsedCSON[source];
                    Object.keys(snippets).forEach((key) => {
                        const snippet = snippets[key];
                        const parsedSnippet = {
                            name: key,
                            description: "No description provided",
                            prefix: snippet.prefix,
                            body: snippet.body.split('\n'),
                            scope: source,
                        };
                        parsedSnippets.push(parsedSnippet);
                    });
                });
                return parsedSnippets;
            }
            catch (error) {
                throw new Error(`Error parsing parsed CSON object: ${error.message}`);
            }
        });
    }
    static isSnippet(filePathOrString) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCSON = yield Promise.resolve(filePathOrString.endsWith('.cson'));
            const isSnippet = yield Promise.resolve(filePathOrString.includes(".source"));
            const isCorrectFormat = yield Atom.parse(filePathOrString).then((snippets) => snippets.every((snippet) => snippet.prefix !== undefined && snippet.body !== undefined));
            return yield Promise.all([isCSON, isSnippet, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
    static parseFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const csonContent = yield (0, promises_1.readFile)(filePath, 'utf8');
                return Atom.parse(csonContent);
            }
            catch (error) {
                throw new Error(`Error reading or parsing CSON file: ${error.message}`);
            }
        });
    }
    static parse(csonContent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!csonContent)
                    throw new Error('No CSON content provided');
                if (typeof csonContent !== 'string')
                    throw new Error('CSON content must be a string');
                const parsedCSON = (0, cson_parser_1.parse)(csonContent);
                if (Object.keys(parsedCSON).length === 0)
                    throw new Error('Parsed CSON object is empty');
                const sources = Atom.getSources(parsedCSON);
                if (sources.length === 0)
                    throw new Error('Parsed CSON object has no sources');
                return yield Atom.parseParsedCSON(parsedCSON, sources);
            }
            catch (error) {
                throw new Error(`Error parsing CSON string: ${error.message}`);
            }
        });
    }
    static stringify(snippets) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snippetObject = snippets.map((snippet) => ({
                    [`${snippet.name}`]: {
                        prefix: snippet.prefix,
                        body: snippet.body.join('\n')
                    }
                }));
                const sourcedSnippets = (0, helpers_1.addKeysToObject)(snippetObject, {});
                return (0, cson_parser_1.stringify)({
                    '*': sourcedSnippets
                }, undefined, 2)
                    .replace(/prefix/g, "'prefix'")
                    .replace(/body/g, "'body'");
            }
            catch (error) {
                throw new Error(`Error stringifying snippets: ${error.message}`);
            }
        });
    }
}
exports.default = Atom;
