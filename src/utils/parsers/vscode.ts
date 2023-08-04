import { ParsedSnippet } from '@interfaces';
import { readFileSync } from 'fs';

/**
 * Represents a utility class for working with Visual Studio Code (VS Code) snippets.
 */
class VSCODE {
    /**
     * Parses a JSON string containing VS Code snippet data and returns an array of parsed snippets.
     * @param json - The JSON string containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error parsing the JSON.
     */
    static parse(json: string): ParsedSnippet[] | null {
        try {
            const parsedSnippets = JSON.parse(json);
            return Object.keys(parsedSnippets).map((key) => ({
                name: key,
                ...parsedSnippets[key]
            }));
        } catch (error: any) {
            console.error('Error parsing snippet:', error.message);
            return null;
        }
    }

    /**
     * Converts an array of parsed snippets into a formatted JSON string.
     * @param snippets - An array of parsed snippet objects.
     * @returns A formatted JSON string representing the snippets.
     */
    static stringify(snippets: ParsedSnippet[]): string {
        const formattedSnippets = snippets.reduce((acc, snippet) => ({
            ...acc,
            [`${snippet.name}`]: {
                prefix: snippet.prefix,
                body: snippet.body,
                description: snippet.description
            }
        }), {});

        return JSON.stringify(formattedSnippets, null, 2);
    }

    /**
     * Parses a JSON file containing VS Code snippet data and returns an array of parsed snippets.
     * @param filePath - The path to the JSON file containing VS Code snippet data.
     * @returns An array of parsed snippet objects, or `null` if there is an error reading or parsing the file.
     */
    static parseFile(filePath: string): ParsedSnippet[] | null {
        try {
            const snippetData = readFileSync(filePath, 'utf-8');
            return VSCODE.parse(snippetData);
        } catch (error: any) {
            console.error('Error reading or parsing snippet file:', error.message);
            return null;
        }
    }
}

export default VSCODE;

