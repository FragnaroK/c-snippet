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
/**
 * Represents a utility class for working with Visual Studio Code (VS Code) snippets.
 */
class VSCODE {
    /**
     * Checks if the given file path or string is a VS Code snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a VS Code snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the JSON.
     *
     */
    static isSnippet(filePathOrString) {
        return __awaiter(this, void 0, void 0, function* () {
            const isJSON = yield Promise.resolve(filePathOrString.endsWith('.json'));
            const isSnippet = yield Promise.resolve(filePathOrString.endsWith('.code-snippets'));
            const isCorrectFormat = yield VSCODE.parse(filePathOrString).then((snippets) => snippets.every((snippet) => {
                return snippet.prefix !== undefined && snippet.body !== undefined;
            }));
            return yield Promise.all([isJSON, isSnippet, isCorrectFormat]).then((values) => values.some((value) => value === true));
        });
    }
    /**
     * Parses a JSON file containing VS Code snippet data and returns an array of parsed snippets.
     * @param filePath - The path to the JSON file containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error reading or parsing the file.
     */
    static parseFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snippetData = yield (0, promises_1.readFile)(filePath, 'utf-8');
                return VSCODE.parse(snippetData);
            }
            catch (error) {
                throw new Error('Failed to parse VS Code snippet JSON: ' + error.message);
            }
        });
    }
    /**
     * Parses a JSON string containing VS Code snippet data and returns an array of parsed snippets.
     * @param json - The JSON string containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error parsing the JSON.
     */
    static parse(json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedSnippets = JSON.parse(json);
                return Object.keys(parsedSnippets).map((key) => (Object.assign({ name: key }, parsedSnippets[key])));
            }
            catch (error) {
                throw new Error('Failed to parse VS Code snippet JSON: ' + error.message);
            }
        });
    }
    /**
     * Converts an array of parsed snippets into a formatted JSON string.
     * @param snippets - An array of parsed snippet objects.
     * @returns A formatted JSON string representing the snippets.
     */
    static stringify(snippets) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedSnippets = snippets.reduce((acc, snippet) => (Object.assign(Object.assign({}, acc), { [`${snippet.name}`]: {
                        prefix: snippet.prefix,
                        body: snippet.body,
                        description: snippet.description
                    } })), {});
                return JSON.stringify(formattedSnippets, null, 2);
            }
            catch (error) {
                throw new Error('Failed to stringify VS Code snippet JSON: ' + error.message);
            }
        });
    }
}
exports.default = VSCODE;
