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
const utils_1 = __importDefault(require("./utils/utils"));
const helpers_1 = require("./utils/helpers");
const node_logger_cli_1 = __importDefault(require("node-logger-cli"));
/**
 * Class representing a converter for snippets.
 */
class Converter {
    /**
     * Create a converter instance.
     * @param {string} snippets - Snippets to be converted.
     * @param {ParserType} [target] - Optional target type of the snippets.
     * @param {ParserType} [source] - Optional source type of the snippets.
     */
    constructor(snippets, target, source) {
        this.log = new node_logger_cli_1.default("Converter", process.env.NODE_ENV === "development");
        this.log.d("Creating converter instance", { snippets, target, source });
        this.source = source;
        this.target = target;
        this.snippets = snippets;
        this.parsers = {
            vscode: utils_1.default.VSCODE,
            sublime: utils_1.default.SUBLIME,
            dreamweaver: utils_1.default.DREAMWEAVER,
            atom: utils_1.default.ATOM,
        };
    }
    /**
     * Get the name of the snippet.
     * @param {string} snippet - The snippet content.
     * @returns {string} The name of the snippet.
     */
    static getSnippetName(snippet) {
        const log = new node_logger_cli_1.default("Converter", process.env.NODE_ENV === "development");
        log.d("Getting snippet name", { snippet });
        const { start, end } = helpers_1.parserVariables.snippetName;
        log.d("Macro start and end", { start, end });
        const startStr = snippet.indexOf(start);
        const endStr = snippet.indexOf(end);
        log.d("Start and end index", { startStr, endStr });
        const name = startStr !== -1 && endStr !== -1 ? snippet.substring(startStr + start.length, endStr) : 'unnamed-snippet';
        log.d("Snippet name", { name });
        return name;
    }
    /**
     * Initialize the converter instance.
     * @returns {Promise<ConverterInterface>} The initialized converter instance.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.source) {
                this.log.d("Source not specified, identifying source...");
                this.source = yield this.findSource();
                this.log.d("Source found", { source: this.source });
            }
            this.log.d("Converter initialized", { source: this.source, target: this.target, snippets: this.snippets });
            return this;
        });
    }
    /**
     * Find the source parser for the snippets.
     * @returns {Promise<ParserType>} The source parser type.
     * @throws {Error} If no valid source parser is found.
     */
    findSource() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = Object.keys(this.parsers).map((parser) => __awaiter(this, void 0, void 0, function* () {
                return this.parsers[parser].isSnippet(this.snippets, "").catch(() => false);
            }));
            const results = yield Promise.all(promises);
            const sourceIndex = results.findIndex((result) => result);
            if (sourceIndex !== -1) {
                return Object.keys(this.parsers)[sourceIndex];
            }
            throw new Error('Snippets not valid');
        });
    }
    /**
     * Parse the snippets using the appropriate parser.
     * @param {ParserType} [source] - Optional source parser type.
     * @returns {Promise<ParsedSnippet[]>} The parsed snippets.
     * @throws {Error} If parsing fails or no source is found.
     */
    parse(source) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.d("Parsing snippets", { source, snippets: this.snippets });
            if (!source)
                source = this.source;
            if (!source)
                throw new Error('No source found');
            const rawSnippets = this.snippets.includes(helpers_1.parserVariables.divider) ? this.snippets.split(helpers_1.parserVariables.divider) : [this.snippets];
            if (['vscode', 'atom'].includes(source)) {
                this.log.d("Parsing snippets from vscode or atom", { source, snippets: rawSnippets });
                return yield this.parsers[source].parse(this.snippets, "");
            }
            if (['sublime', 'dreamweaver'].includes(source)) {
                this.log.d("Parsing snippets from sublime or dreamweaver", { source, snippets: rawSnippets });
                const parsePromises = rawSnippets.map((snip) => __awaiter(this, void 0, void 0, function* () {
                    const name = source === 'sublime' ? Converter.getSnippetName(snip) : undefined;
                    return this.parsers[source].parse(snip, name !== null && name !== void 0 ? name : "");
                }));
                return Promise.all(parsePromises);
            }
            throw new Error('No parser found for ' + source);
        });
    }
    /**
     * Convert the parsed snippets.
     * @param {ParsedSnippet[]} [snippet] - The parsed snippets to be converted.
     * @param {ParserType} [to] - The target parser type.
     * @returns {Promise<string>} The converted snippets.
     * @throws {Error} If the method is not implemented.
     */
    convert(snippet, to) {
        return __awaiter(this, void 0, void 0, function* () {
            this.log.d("Converting snippets", { snippet, to, target: this.target });
            if (!snippet)
                snippet = yield this.parse();
            if (!to)
                to = this.target;
            if (!to)
                throw new Error('No target found');
            const convertPromises = [];
            if (['vscode', 'atom'].includes(to)) {
                this.log.d("Converting snippets to vscode or atom", { to, snippets: snippet });
                convertPromises.push(this.parsers[to].stringify(snippet));
            }
            if (['sublime', 'dreamweaver'].includes(to)) {
                this.log.d("Converting snippets to sublime or dreamweaver", { to, snippets: snippet });
                const stringified = snippet.map((snip) => __awaiter(this, void 0, void 0, function* () {
                    return this.parsers[to].stringify(snip);
                }));
                convertPromises.push(...stringified);
            }
            const convertedSnippets = yield Promise.all(convertPromises);
            return convertedSnippets.join(helpers_1.parserVariables.divider);
        });
    }
}
exports.default = Converter;
