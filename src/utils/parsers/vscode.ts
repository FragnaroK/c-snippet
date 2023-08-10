import { ParsedSnippet } from '../../types/types';
import { readFile } from 'fs/promises';

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
    public static async isSnippet(filePathOrString: string): Promise<boolean> {

        const isJSON = await Promise.resolve(filePathOrString.endsWith('.json'));
        const isSnippet = await Promise.resolve(filePathOrString.endsWith('.code-snippets'));
        const isCorrectFormat = await VSCODE.parse(filePathOrString).then((snippets) => snippets.every((snippet) => {
            return snippet.prefix !== undefined && snippet.body !== undefined;
        }));

        return await Promise.all([isJSON, isSnippet, isCorrectFormat]).then((values) => values.some((value) => value === true));
    }

    /**
     * Parses a JSON file containing VS Code snippet data and returns an array of parsed snippets.
     * @param filePath - The path to the JSON file containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error reading or parsing the file.
     */
    public static async parseFile(filePath: string): Promise<ParsedSnippet[]> {
        try {
            const snippetData = await readFile(filePath, 'utf-8');
            return VSCODE.parse(snippetData);
        } catch (error: any) {
            throw new Error('Failed to parse VS Code snippet JSON: ' + error.message);
        }
    }

    /**
     * Parses a JSON string containing VS Code snippet data and returns an array of parsed snippets.
     * @param json - The JSON string containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error parsing the JSON.
     */
    public static async parse(json: string): Promise<ParsedSnippet[]> {
        try {
            const parsedSnippets = JSON.parse(json);
            return Object.keys(parsedSnippets).map((key) => ({
                name: key,
                ...parsedSnippets[key]
            }));
        } catch (error: any) {
            throw new Error('Failed to parse VS Code snippet JSON: ' + error.message);
        }
    }

    /**
     * Converts an array of parsed snippets into a formatted JSON string.
     * @param snippets - An array of parsed snippet objects.
     * @returns A formatted JSON string representing the snippets.
     */
    public static async stringify(snippets: ParsedSnippet[]): Promise<string> {
        try {
            const formattedSnippets = snippets.reduce((acc, snippet) => ({
                ...acc,
                [`${snippet.name}`]: {
                    prefix: snippet.prefix,
                    body: snippet.body,
                    description: snippet.description
                }
            }), {});

            return JSON.stringify(formattedSnippets, null, 2);
        } catch (error: any) {
            throw new Error('Failed to stringify VS Code snippet JSON: ' + error.message);
        }
    }


}

export default VSCODE;

