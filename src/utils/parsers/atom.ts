import { readFile } from 'fs/promises';
import { parse, stringify } from 'cson-parser';
import { ParsedSnippet } from "@interfaces"
import { addKeysToObject } from '../helpers';

class Atom {
    static getSources(parsedCSON: any): string[] {
        return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
    }

    static async parseFile(filePath: string): Promise<ParsedSnippet[]> {
        try {
            const csonContent = await readFile(filePath, 'utf8');
            const parsedObject = parse(csonContent);
            return Atom.parseParsedCSON(parsedObject);
        } catch (error: any) {
            throw new Error(`Error reading or parsing CSON file: ${error.message}`);
        }
    }

    static parseString(csonContent: string): ParsedSnippet[] {
        const parsedCSON = parse(csonContent);
        return Atom.parseParsedCSON(parsedCSON);
    }

    static parseParsedCSON(parsedCSON: any): ParsedSnippet[] {
        const sources = Atom.getSources(parsedCSON);
        const parsedSnippets: ParsedSnippet[] = [];

        sources.forEach((source) => {
            const snippets = parsedCSON[source];
            Object.keys(snippets).forEach((key) => {
                const snippet = snippets[key];
                const parsedSnippet: ParsedSnippet = {
                    name: key,
                    description: snippet.description || "No description provided",
                    prefix: snippet.prefix,
                    body: snippet.body.split('\n'),
                    scope: source,
                };
                parsedSnippets.push(parsedSnippet);
            });
        });

        return parsedSnippets;
    }

    static stringifySnippet(snippets: ParsedSnippet[]): string {
        const snippetObject = snippets.map((snippet) => ({
            [`${snippet.name}`]: {
                prefix: snippet.prefix,
                body: snippet.body.join('\n')
            }
        }));

        const sourcedSnippets = addKeysToObject(snippetObject, {});

        return stringify({
            '*': sourcedSnippets
        }, undefined, 2)
            .replace(/prefix/g, "'prefix'")
            .replace(/body/g, "'body'");
    }
}

export default Atom;
