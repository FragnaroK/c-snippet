import Utils from './utils/utils';
import { ConverterInterface, ParsedSnippet, ParserType } from './types/types';
import { parser_variables } from './utils/helpers';

// Destructure utility functions and types from Utils module
const { ATOM, DREAMWEAVER, SUBLIME, VSCODE } = Utils;

/**
 * Class representing a converter for snippets.
 */
class Converter implements ConverterInterface {
    /** The source of the parser. */
    source?: ParserType;
    /** Available parsers for different snippet formats. */
    parsers: Record<string, typeof VSCODE | typeof SUBLIME | typeof DREAMWEAVER | typeof ATOM>;
    /** Snippets to be converted. */
    snippets: string;

    /**
     * Create a converter instance.
     * @param {string} snippets - Snippets to be converted.
     * @param {ParserType} source - Optional source type of the snippets.
     */
    constructor(snippets: string, source?: ParserType) {
        this.source = source;
        this.snippets = snippets;
        this.parsers = {
            vscode: VSCODE,
            sublime: SUBLIME,
            dreamweaver: DREAMWEAVER,
            atom: ATOM,
        };
    }

    /**
 * Get the name of the snippet.
 * @param {string} snippet - The snippet content.
 * @returns {string} The name of the snippet.
 */
    private static getSnippetName(snippet: string): string {
        const { start, end } = parser_variables.snippetName;
        const startStr = snippet.indexOf(start);
        const endStr = snippet.indexOf(end);
        return startStr !== -1 && endStr !== -1 ? snippet.substring(startStr + start.length, endStr) : 'unnamed-snippet';
    }

    /**
     * Initialize the converter instance.
     * @returns {Promise<ConverterInterface>} The initialized converter instance.
     */
    async init(): Promise<ConverterInterface> {
        if (!this.source) {
            this.source = await this.findSource();
        }
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
 * @param {ParserType} source - Optional source parser type.
 * @returns {Promise<ParsedSnippet[]>} The parsed snippets.
 * @throws {Error} If parsing fails or no source is found.
 */
    async parse(source?: ParserType): Promise<ParsedSnippet[]> {
        if (!source) source = this.source;
        if (!source) throw new Error('No source found');

        const rawSnippets = this.snippets.includes(parser_variables.divider) ? this.snippets.split(parser_variables.divider) : [this.snippets];

        if (source === 'vscode' || source === 'atom') {
            return await this.parsers[source].parse(this.snippets, "") as ParsedSnippet[];
        }

        if (source === 'sublime' || source === 'dreamweaver') {
            const isSublime = source === 'sublime';
            const parsePromises = rawSnippets.map(async (snip) => {
                const name = isSublime ? Converter.getSnippetName(snip) : undefined;
                return this.parsers[source ?? this.source!].parse(snip, name ?? "") as Promise<ParsedSnippet>;
            });
            return Promise.all(parsePromises);
        }

        throw new Error('No parser found for ' + source);
    }

    /**
 * Convert the parsed snippets.
 * @param {ParsedSnippet[]} snippet - The parsed snippets to be converted.
 * @returns {Promise<string>} The converted snippets.
 * @throws {Error} If the method is not implemented.
 */
    async convert(snippet?: ParsedSnippet[]): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

export default Converter;
