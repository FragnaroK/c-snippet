import { ParsedSnippet } from '@interfaces';
import { readFileSync } from 'fs';

class VSCODE {
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
