import Utils from './utils/utils';
import { ConverterInterface, ParsedSnippet, ParserType } from './types/types';
/**
 * Class representing a converter for snippets.
 */
declare class Converter implements ConverterInterface {
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
    constructor(snippets: string, target?: ParserType, source?: ParserType);
    /**
     * Get the name of the snippet.
     * @param {string} snippet - The snippet content.
     * @returns {string} The name of the snippet.
     */
    private static getSnippetName;
    /**
     * Initialize the converter instance.
     * @returns {Promise<ConverterInterface>} The initialized converter instance.
     */
    init(): Promise<ConverterInterface>;
    /**
     * Find the source parser for the snippets.
     * @returns {Promise<ParserType>} The source parser type.
     * @throws {Error} If no valid source parser is found.
     */
    findSource(): Promise<ParserType>;
    /**
     * Parse the snippets using the appropriate parser.
     * @param {ParserType} [source] - Optional source parser type.
     * @returns {Promise<ParsedSnippet[]>} The parsed snippets.
     * @throws {Error} If parsing fails or no source is found.
     */
    parse(source?: ParserType): Promise<ParsedSnippet[]>;
    /**
     * Convert the parsed snippets.
     * @param {ParsedSnippet[]} [snippet] - The parsed snippets to be converted.
     * @param {ParserType} [to] - The target parser type.
     * @returns {Promise<string>} The converted snippets.
     * @throws {Error} If the method is not implemented.
     */
    convert(snippet?: ParsedSnippet[], to?: ParserType): Promise<string>;
}
export default Converter;
