import Utils from './utils/utils';
import { ConverterInterface, ParsedSnippet, ParserType } from './types/types';
import { parserVariables } from './utils/helpers';
import Logger from 'node-logger-cli';

/**
 * Class representing a converter for snippets.
 */
class Converter implements ConverterInterface {

    private log = new Logger("Converter", process.env.NODE_ENV === "development")

    /**
     * The source of the parser.
     * @type {ParserType | undefined}
     */
    source?: ParserType;

    /**
     * The editor that the snippets will be converted to.
     * @type {ParserType | undefined}
     */
    target?: ParserType;

    /**
     * Available parsers for different snippet formats.
     * @type {Record<string, typeof VSCODE | typeof SUBLIME | typeof DREAMWEAVER | typeof ATOM>}
     */
    parsers: Record<string, typeof Utils.VSCODE | typeof Utils.SUBLIME | typeof Utils.DREAMWEAVER | typeof Utils.ATOM>;

    /**
     * Snippets to be converted.
     * @type {string}
     */
    snippets: string;

    /**
     * Create a converter instance.
     * @param {string} snippets - Snippets to be converted.
     * @param {ParserType} [target] - Optional target type of the snippets.
     * @param {ParserType} [source] - Optional source type of the snippets.
     */
    constructor(snippets: string, target?: ParserType, source?: ParserType) {
        this.log.d("Creating converter instance", { snippets, target, source })
        this.source = source;
        this.target = target;
        this.snippets = snippets;
        this.parsers = {
            vscode: Utils.VSCODE,
            sublime: Utils.SUBLIME,
            dreamweaver: Utils.DREAMWEAVER,
            atom: Utils.ATOM,
        };
    }

    /**
     * Get the name of the snippet.
     * @param {string} snippet - The snippet content.
     * @returns {string} The name of the snippet.
     */
    private static getSnippetName(snippet: string): string {
        const log = new Logger("Converter", process.env.NODE_ENV === "development")
        log.d("Getting snippet name", { snippet })
        const { start, end } = parserVariables.snippetName;
        log.d("Macro start and end", { start, end })
        const startStr = snippet.indexOf(start);
        const endStr = snippet.indexOf(end);
        log.d("Start and end index", { startStr, endStr })
        const name = startStr !== -1 && endStr !== -1 ? snippet.substring(startStr + start.length, endStr) : 'unnamed-snippet';
        log.d("Snippet name", { name })
        return name;
    }

    /**
     * Initialize the converter instance.
     * @returns {Promise<ConverterInterface>} The initialized converter instance.
     */
    async init(): Promise<ConverterInterface> {
        if (!this.source) {
            this.log.d("Source not specified, identifying source...")
            this.source = await this.findSource();
            this.log.d("Source found", { source: this.source })
        }
        this.log.d("Converter initialized", { source: this.source, target: this.target, snippets: this.snippets })
        return this;
    }

    /**
     * Find the source parser for the snippets.
     * @returns {Promise<ParserType>} The source parser type.
     * @throws {Error} If no valid source parser is found.
     */
    async findSource(): Promise<ParserType> {
        const promises = Object.keys(this.parsers).map(async (parser) => {
            return this.parsers[parser].isSnippet(this.snippets, "").catch(() => false);
        });

        const results = await Promise.all(promises);
        const sourceIndex = results.findIndex((result) => result);

        if (sourceIndex !== -1) {
            return Object.keys(this.parsers)[sourceIndex] as ParserType;
        }

        throw new Error('Snippets not valid');
    }

    /**
     * Parse the snippets using the appropriate parser.
     * @param {ParserType} [source] - Optional source parser type.
     * @returns {Promise<ParsedSnippet[]>} The parsed snippets.
     * @throws {Error} If parsing fails or no source is found.
     */
    async parse(source?: ParserType): Promise<ParsedSnippet[]> {
        this.log.d("Parsing snippets", { source, snippets: this.snippets })
        if (!source) source = this.source;
        if (!source) throw new Error('No source found');

        const rawSnippets = this.snippets.includes(parserVariables.divider) ? this.snippets.split(parserVariables.divider) : [this.snippets];

        if (['vscode', 'atom'].includes(source)) {
            this.log.d("Parsing snippets from vscode or atom", { source, snippets: rawSnippets })
            return await this.parsers[source].parse(this.snippets, "") as ParsedSnippet[];
        }

        if (['sublime', 'dreamweaver'].includes(source)) {
            this.log.d("Parsing snippets from sublime or dreamweaver", { source, snippets: rawSnippets })
            const parsePromises = rawSnippets.map(async (snip) => {
                const name = source === 'sublime' ? Converter.getSnippetName(snip) : undefined;
                return this.parsers[source!].parse(snip, name ?? "") as Promise<ParsedSnippet>;
            });
            return Promise.all(parsePromises);
        }

        throw new Error('No parser found for ' + source);
    }

    /**
     * Convert the parsed snippets.
     * @param {ParsedSnippet[]} [snippet] - The parsed snippets to be converted.
     * @param {ParserType} [to] - The target parser type.
     * @returns {Promise<string>} The converted snippets.
     * @throws {Error} If the method is not implemented.
     */
    async convert(snippet?: ParsedSnippet[], to?: ParserType): Promise<string> {
        this.log.d("Converting snippets", { snippet, to, target: this.target })
        if (!snippet) snippet = await this.parse();
        if (!to) to = this.target;
        if (!to) throw new Error('No target found');

        const convertPromises: Promise<string>[] = [];

        if (['vscode', 'atom'].includes(to)) {
            this.log.d("Converting snippets to vscode or atom", { to, snippets: snippet })
            convertPromises.push(this.parsers[to].stringify(snippet as ParsedSnippet[] & ParsedSnippet));
        }

        if (['sublime', 'dreamweaver'].includes(to)) {
            this.log.d("Converting snippets to sublime or dreamweaver", { to, snippets: snippet })
            const stringified = snippet.map(async (snip) => {
                return this.parsers[to!].stringify(snip as ParsedSnippet[] & ParsedSnippet);
            });
            convertPromises.push(...stringified);
        }

        const convertedSnippets = await Promise.all(convertPromises);
        return convertedSnippets.join(parserVariables.divider);
    }
}

export default Converter;
