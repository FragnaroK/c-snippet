import { ParsedSnippet } from '../../types/types';
/**
 * A utility class for parsing and stringifying Sublime Text snippets.
 */
declare class Sublime {
    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     *
     */
    static isSnippet(filePathOrString: string, name: string): Promise<boolean>;
    /**
     * Parses a Sublime Text snippet file asynchronously and returns a parsed snippet object.
     * @param {string} snippetPath - The path to the Sublime Text snippet file.
     * @returns {Promise<ParsedSnippet>} - A promise that resolves to the parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue reading or parsing the snippet file.
     */
    static parseFile(snippetPath: string): Promise<ParsedSnippet>;
    /**
     * Parses a Sublime Text snippet string and returns a parsed snippet object.
     * @param {string} snippet - The Sublime Text snippet string.
     * @returns {ParsedSnippet} - The parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue parsing the snippet string.
     */
    static parse(snippet: string, name: string): Promise<ParsedSnippet>;
    /**
     * Converts a parsed snippet object to a formatted XML string for Sublime Text.
     * @param {ParsedSnippet} parsedSnippet - The parsed snippet object to be converted.
     * @returns {string} - A formatted XML string representing the Sublime Text snippet.
     * @throws {Error} - Throws an error if there's an issue converting the parsed snippet object.
     * @see {@link https://www.sublimetext.com/docs/3/snippets.html|Sublime Text Snippets}
     *
     */
    static stringify(parsedSnippet: ParsedSnippet): Promise<string>;
}
export default Sublime;
