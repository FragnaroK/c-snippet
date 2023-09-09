import { ParsedSnippet } from '../../types/types';
/**
 * Represents a utility class for working with Visual Studio Code (VS Code) snippets.
 */
declare class VSCODE {
    /**
     * Checks if the given file path or string is a VS Code snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a VS Code snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the JSON.
     *
     */
    static isSnippet(filePathOrString: string): Promise<boolean>;
    /**
     * Parses a JSON file containing VS Code snippet data and returns an array of parsed snippets.
     * @param filePath - The path to the JSON file containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error reading or parsing the file.
     */
    static parseFile(filePath: string): Promise<ParsedSnippet[]>;
    /**
     * Parses a JSON string containing VS Code snippet data and returns an array of parsed snippets.
     * @param json - The JSON string containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error parsing the JSON.
     */
    static parse(json: string): Promise<ParsedSnippet[]>;
    /**
     * Converts an array of parsed snippets into a formatted JSON string.
     * @param snippets - An array of parsed snippet objects.
     * @returns A formatted JSON string representing the snippets.
     */
    static stringify(snippets: ParsedSnippet[]): Promise<string>;
}
export default VSCODE;
