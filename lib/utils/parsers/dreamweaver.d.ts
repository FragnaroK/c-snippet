import { ParsedSnippet } from '../../types/types';
/**
 * Represents a utility class for working with Dreamweaver snippets.
 */
declare class Dreamweaver {
    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     *
     */
    static isSnippet(filePathOrString: string): Promise<boolean>;
    /**
     * Parses a Dreamweaver snippet XML file and returns a parsed snippet object.
     * @param filePath - The path to the Dreamweaver snippet XML file.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error reading the file or parsing the Dreamweaver snippet XML.
     */
    static parseFile(filePath: string): Promise<ParsedSnippet>;
    /**
     * Parses a Dreamweaver snippet XML string and returns a parsed snippet object.
     * @param snippet - The Dreamweaver snippet XML string.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error parsing the Dreamweaver snippet XML.
     */
    static parse(snippet: string): Promise<ParsedSnippet>;
    /**
     * Converts a parsed snippet object into a Dreamweaver snippet XML string.
     * @param snippet - A parsed snippet object.
     * @returns A Dreamweaver snippet XML string.
     */
    static stringify(snippet: ParsedSnippet): Promise<string>;
}
export default Dreamweaver;
