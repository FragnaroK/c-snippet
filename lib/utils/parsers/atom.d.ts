import { ParsedSnippet } from "../../types/types";
/**
 * Represents a utility class for working with Atom snippets.
 */
declare class Atom {
    /**
     * Retrieves an array of source keys from the parsed CSON object.
     * @param parsedCSON - The parsed CSON object.
     * @returns An array of source strings.
     */
    private static getSources;
    /**
    * Parses a parsed CSON object and returns an array of parsed snippets.
    * @param parsedCSON - The parsed CSON object.
    * @param sources - An array of source strings.
    * @returns An array of parsed snippets.
    */
    private static parseParsedCSON;
    /**
     * Checks if the given file path or string is an Atom snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Atom snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSON.
     *
     */
    static isSnippet(filePathOrString: string): Promise<boolean>;
    /**
     * Parses a CSON file asynchronously and returns an array of parsed snippets.
     * @param filePath - The path to the CSON file.
     * @returns A promise that resolves to an array of parsed snippets.
     * @throws {Error} If there is an error reading or parsing the CSON file.
     */
    static parseFile(filePath: string): Promise<ParsedSnippet[]>;
    /**
     * Parses a CSON-formatted string and returns an array of parsed snippets.
     * @param csonContent - The CSON-formatted content to parse.
     * @returns An array of parsed snippets.
     * @throws {Error} If there is an error parsing the CSON string.
     */
    static parse(csonContent: string): Promise<ParsedSnippet[]>;
    /**
     * Converts an array of parsed snippets to a CSON-formatted string.
     * @param snippets - An array of parsed snippets.
     * @returns A CSON-formatted string representing the snippets.
     */
    static stringify(snippets: ParsedSnippet[]): Promise<string>;
}
export default Atom;
