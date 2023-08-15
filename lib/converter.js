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
class Converter {
    constructor(snippets, target, source) {
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
    static getSnippetName(snippet) {
        const { start, end } = helpers_1.parser_variables.snippetName;
        const startStr = snippet.indexOf(start);
        const endStr = snippet.indexOf(end);
        return startStr !== -1 && endStr !== -1 ? snippet.substring(startStr + start.length, endStr) : 'unnamed-snippet';
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.source) {
                this.source = yield this.findSource();
            }
            return this;
        });
    }
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
    parse(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!source)
                source = this.source;
            if (!source)
                throw new Error('No source found');
            const rawSnippets = this.snippets.includes(helpers_1.parser_variables.divider) ? this.snippets.split(helpers_1.parser_variables.divider) : [this.snippets];
            if (['vscode', 'atom'].includes(source)) {
                return yield this.parsers[source].parse(this.snippets, "");
            }
            if (['sublime', 'dreamweaver'].includes(source)) {
                const parsePromises = rawSnippets.map((snip) => __awaiter(this, void 0, void 0, function* () {
                    const name = source === 'sublime' ? Converter.getSnippetName(snip) : undefined;
                    return this.parsers[source].parse(snip, name !== null && name !== void 0 ? name : "");
                }));
                return Promise.all(parsePromises);
            }
            throw new Error('No parser found for ' + source);
        });
    }
    convert(snippet, to) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!snippet)
                snippet = yield this.parse();
            if (!to)
                to = this.target;
            if (!to)
                throw new Error('No target found');
            const convertPromises = [];
            if (['vscode', 'atom'].includes(to)) {
                convertPromises.push(this.parsers[to].stringify(snippet));
            }
            if (['sublime', 'dreamweaver'].includes(to)) {
                const stringified = snippet.map((snip) => __awaiter(this, void 0, void 0, function* () {
                    return this.parsers[to].stringify(snip);
                }));
                convertPromises.push(...stringified);
            }
            const convertedSnippets = yield Promise.all(convertPromises);
            return convertedSnippets.join(helpers_1.parser_variables.divider);
        });
    }
}
exports.default = Converter;
