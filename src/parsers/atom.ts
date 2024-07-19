import { readFile } from 'fs/promises';
import { parse, stringify } from 'cson-parser';
import { ParsedSnippet, RawAtomSnippets } from "../types/types"
import { addKeysToObject, isArray } from '../utils/helpers';


/**
 * Represents a utility class for working with Atom snippets.
 */
class Atom {
    /**
     * Retrieves an array of source keys from the parsed CSON object.
     * @param parsedCSON - The parsed CSON object.
     * @returns An array of source strings.
     */
    private static getSources(parsedCSON: RawAtomSnippets): string[] {
        return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
    }

    /**
    * Parses a parsed CSON object and returns an array of parsed snippets.
    * @param parsedCSON - The parsed CSON object.
    * @param sources - An array of source strings.
    * @returns An array of parsed snippets.
    */
    private static async parseParsedCSON(parsedCSON: RawAtomSnippets, sources: string[]): Promise<ParsedSnippet[]> {
        try {
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
        } catch (error: any) {
            throw new Error(`Error parsing parsed CSON object: ${error.message}`);
        }
    }

    /**
     * Checks if the given file path or string is an Atom snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Atom snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSON.
     * 
     */
    public static async isSnippet(filePathOrString: string): Promise<boolean> {

        const isCSON = await Promise.resolve(filePathOrString.endsWith('.cson'));
        const isSnippet = await Promise.resolve(filePathOrString.includes(".source"));
        const isCorrectFormat = await Atom.parse(filePathOrString).then((snippets) => snippets.every((snippet) => snippet.prefix !== undefined && snippet.body !== undefined));

        return await Promise.all([isCSON, isSnippet, isCorrectFormat]).then((values) => values.some((value) => value === true));
    }

    /**
     * Parses a CSON file asynchronously and returns an array of parsed snippets.
     * @param filePath - The path to the CSON file.
     * @returns A promise that resolves to an array of parsed snippets.
     * @throws {Error} If there is an error reading or parsing the CSON file.
     */
    public static async parseFile(filePath: string): Promise<ParsedSnippet[]> {
        try {
            const csonContent = await readFile(filePath, 'utf8');
            return Atom.parse(csonContent);
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
    public static async parse(csonContent: string): Promise<ParsedSnippet[]> {
        try {
            if (!csonContent) throw new Error('No CSON content provided');
            if (typeof csonContent !== 'string') throw new Error('CSON content must be a string');

            const parsedCSON = parse(csonContent);

            // Check if the parsed CSON object is empty
            if (Object.keys(parsedCSON).length === 0) throw new Error('Parsed CSON object is empty');

            // Check if the parsed CSON object has any sources
            const sources = Atom.getSources(parsedCSON);
            if (sources.length === 0) throw new Error('Parsed CSON object has no sources');
            // if (sources.length > 1) console.warn('Parsed CSON object has multiple sources, they will be merged into one (global)');

            return await Atom.parseParsedCSON(parsedCSON, sources);
        } catch (error: any) {
            throw new Error(`Error parsing CSON string: ${error.message}`);
        }
    }



    /**
     * Converts an array of parsed snippets to a CSON-formatted string.
     * @param snippets - An array of parsed snippets.
     * @returns A CSON-formatted string representing the snippets.
     */
    public static async stringify(snippets: ParsedSnippet[]): Promise<string> {
        try {
            const snippetObject = snippets.map((snippet) => ({
                [`${snippet.name}`]: {
                    prefix: snippet.prefix,
                    body: isArray(snippet.body) ? snippet.body.join('\n') : snippet.body,
                }
            }));

            const sourcedSnippets = addKeysToObject(snippetObject, {});

            return stringify({
                '*': sourcedSnippets
            }, undefined, 2)
                .replace(/prefix/g, "'prefix'")
                .replace(/body/g, "'body'");
        } catch (error: any) {
            throw new Error(`(ATOM) Error stringifying snippets: ${error.message}`);
        }
    }
}

export default Atom;
