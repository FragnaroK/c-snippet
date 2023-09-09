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
/**
 * Represents a utility class for working with Atom snippets.
 */
class Atom {
    /**
     * Retrieves an array of source keys from the parsed CSON object.
     * @param parsedCSON - The parsed CSON object.
     * @returns An array of source strings.
     */
    static getSources(parsedCSON) {
        return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
    }
    /**
    * Parses a parsed CSON object and returns an array of parsed snippets.
    * @param parsedCSON - The parsed CSON object.
    * @param sources - An array of source strings.
    * @returns An array of parsed snippets.
    */
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
    /**
     * Checks if the given file path or string is an Atom snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Atom snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSON.
     *
     */
    static isSnippet(filePathOrString) {
        return __awaiter(this, void 0, void 0, function* () {
            const isCSON = yield Promise.resolve(filePathOrString.endsWith('.cson'));
            const isSnippet = yield Promise.resolve(filePathOrString.includes(".source"));
            const isCorrectFormat = yield Atom.parse(filePathOrString).then((snippets) => snippets.every((snippet) => snippet.prefix !== undefined && snippet.body !== undefined));
            return yield Promise.all([isCSON, isSnippet, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
    /**
     * Parses a CSON file asynchronously and returns an array of parsed snippets.
     * @param filePath - The path to the CSON file.
     * @returns A promise that resolves to an array of parsed snippets.
     * @throws {Error} If there is an error reading or parsing the CSON file.
     */
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
    /**
     * Parses a CSON-formatted string and returns an array of parsed snippets.
     * @param csonContent - The CSON-formatted content to parse.
     * @returns An array of parsed snippets.
     * @throws {Error} If there is an error parsing the CSON string.
     */
    static parse(csonContent) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!csonContent)
                    throw new Error('No CSON content provided');
                if (typeof csonContent !== 'string')
                    throw new Error('CSON content must be a string');
                const parsedCSON = (0, cson_parser_1.parse)(csonContent);
                // Check if the parsed CSON object is empty
                if (Object.keys(parsedCSON).length === 0)
                    throw new Error('Parsed CSON object is empty');
                // Check if the parsed CSON object has any sources
                const sources = Atom.getSources(parsedCSON);
                if (sources.length === 0)
                    throw new Error('Parsed CSON object has no sources');
                // if (sources.length > 1) console.warn('Parsed CSON object has multiple sources, they will be merged into one (global)');
                return yield Atom.parseParsedCSON(parsedCSON, sources);
            }
            catch (error) {
                throw new Error(`Error parsing CSON string: ${error.message}`);
            }
        });
    }
    /**
     * Converts an array of parsed snippets to a CSON-formatted string.
     * @param snippets - An array of parsed snippets.
     * @returns A CSON-formatted string representing the snippets.
     */
    static stringify(snippets) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snippetObject = snippets.map((snippet) => ({
                    [`${snippet.name}`]: {
                        prefix: snippet.prefix,
                        body: (0, helpers_1.isArray)(snippet.body) ? snippet.body.join('\n') : snippet.body,
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
                throw new Error(`(ATOM) Error stringifying snippets: ${error.message}`);
            }
        });
    }
}
exports.default = Atom;
