import { readFile } from 'fs/promises';
import { parse, stringify } from 'cson-parser';
import { ParsedSnippet, RawAtomSnippets } from "@interfaces"
import { addKeysToObject } from '../helpers';


/**
 * Represents a utility class for working with Atom snippets.
 */
class Atom {
    /**
     * Retrieves an array of source keys from the parsed CSON object.
     * @param parsedCSON - The parsed CSON object.
     * @returns An array of source strings.
     */
    static getSources(parsedCSON: RawAtomSnippets): string[] {
        return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
    }

    /**
     * Parses a CSON file asynchronously and returns an array of parsed snippets.
     * @param filePath - The path to the CSON file.
     * @returns A promise that resolves to an array of parsed snippets.
     * @throws {Error} If there is an error reading or parsing the CSON file.
     */
    static async parseFile(filePath: string): Promise<ParsedSnippet[]> {
        try {
            const csonContent = await readFile(filePath, 'utf8');
            return Atom.parseString(csonContent);
        } catch (error: any) {
            throw new Error(`Error reading or parsing CSON file: ${error.message}`);
        }
    }

    /**
     * Parses a CSON-formatted string and returns an array of parsed snippets.
     * @param csonContent - The CSON-formatted content to parse.
     * @returns An array of parsed snippets.
     * @throws {Error} If there is an error parsing the CSON string.
     */
    static parseString(csonContent: string): ParsedSnippet[] {
        try {
            if (!csonContent) throw new Error('No CSON content provided');
            if (typeof csonContent !== 'string') throw new Error('CSON content must be a string');

            const parsedCSON = parse(csonContent);

            // Check if the parsed CSON object is empty
            if (Object.keys(parsedCSON).length === 0) throw new Error('Parsed CSON object is empty');

            // Check if the parsed CSON object has any sources
            const sources = Atom.getSources(parsedCSON);
            if (sources.length === 0) throw new Error('Parsed CSON object has no sources');
            if (sources.length > 1) console.warn('Parsed CSON object has multiple sources, they will be merged into one (global)');

            return Atom.parseParsedCSON(parsedCSON, sources);
        } catch (error: any) {
            throw new Error(`Error parsing CSON string: ${error.message}`);
        }
    }

    /**
     * Parses a parsed CSON object and returns an array of parsed snippets.
     * @param parsedCSON - The parsed CSON object.
     * @param sources - An array of source strings.
     * @returns An array of parsed snippets.
     */
    static parseParsedCSON(parsedCSON: RawAtomSnippets, sources: string[]): ParsedSnippet[] {
        const parsedSnippets: ParsedSnippet[] = [];

        sources.forEach((source) => {
            const snippets = parsedCSON[source];
            Object.keys(snippets).forEach((key) => {
                const snippet = snippets[key];
                const parsedSnippet: ParsedSnippet = {
                    name: key,
                    description: "No description provided",
                    prefix: snippet.prefix,
                    body: snippet.body.split('\n'),
                    scope: source,
                };
                parsedSnippets.push(parsedSnippet);
            });
        });

        return parsedSnippets;
    }

    /**
     * Converts an array of parsed snippets to a CSON-formatted string.
     * @param snippets - An array of parsed snippets.
     * @returns A CSON-formatted string representing the snippets.
     */
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
