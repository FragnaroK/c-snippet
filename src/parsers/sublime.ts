import { ParsedSnippet, RawSublimeSnippets } from '../types/types';
import { readFile } from 'fs/promises';
import { Parser, Builder } from 'xml2js';
import { escapeSpecialCharacters, isArray, prettifyHTML, trimArray } from '../utils/helpers';

/**
 * A utility class for parsing and stringifying Sublime Text snippets.
 */
class Sublime {

    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     * 
     */
    public static async isSnippet(filePathOrString: string, name: string): Promise<boolean> {

        const isSublime = await Promise.resolve(filePathOrString.endsWith('.sublime-snippet'));
        const isCorrectFormat = await Sublime.parse(filePathOrString, name).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);

        return await Promise.all([isSublime, isCorrectFormat]).then((values) => values.some((value) => value === true));
    }

    /**
     * Parses a Sublime Text snippet file asynchronously and returns a parsed snippet object.
     * @param {string} snippetPath - The path to the Sublime Text snippet file.
     * @returns {Promise<ParsedSnippet>} - A promise that resolves to the parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue reading or parsing the snippet file.
     */
    public static async parseFile(snippetPath: string): Promise<ParsedSnippet> {
        try {
            const data = await readFile(snippetPath, 'utf-8');
            return Sublime.parse(data, snippetPath.slice(snippetPath.lastIndexOf('/') + 1));
        } catch (error: any) {
            throw new Error(`Error parsing Sublime Text snippet: ${error.message}`);
        }
    }

    /**
     * Parses a Sublime Text snippet string and returns a parsed snippet object.
     * @param {string} snippet - The Sublime Text snippet string.
     * @returns {ParsedSnippet} - The parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue parsing the snippet string.
     */
    public static async parse(snippet: string, name: string): Promise<ParsedSnippet> {
        try {
            const parser = new Parser();
            const parsedSnippet: ParsedSnippet = { body: [], scope: '' };

            parser.parseString(snippet, (err, res) => {
                if (err) {
                    throw new Error(`Error parsing Sublime Text snippet: ${err.message}`);
                }
                const snippetElement = res.snippet;
                parsedSnippet.name = name;
                parsedSnippet.description = snippetElement.description[0];
                parsedSnippet.prefix = snippetElement.tabTrigger[0];
                parsedSnippet.body = trimArray(snippetElement.content?.[0].split('\n')) || [];
                parsedSnippet.scope = snippetElement.scope[0];

            });

            return parsedSnippet;

        } catch (error: any) {
            throw new Error(`Error parsing Sublime Text snippet: ${error.message}`);
        }
    }

    /**
     * Converts a parsed snippet object to a formatted XML string for Sublime Text.
     * @param {ParsedSnippet} parsedSnippet - The parsed snippet object to be converted.
     * @returns {string} - A formatted XML string representing the Sublime Text snippet.
     * @throws {Error} - Throws an error if there's an issue converting the parsed snippet object.
     * @see {@link https://www.sublimetext.com/docs/3/snippets.html|Sublime Text Snippets}
     *
     */
    public static async stringify(parsedSnippet: ParsedSnippet): Promise<string> {
        try {
            const builder = new Builder({
                headless: true,
                renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
                cdata: true,
                xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },

            });

            const { body, prefix, description, name } = parsedSnippet;

            // <FORCEDATA> is a workaround to force xml2js to render CDATA
            // ? Could be improved by using a custom render function

            const xmlObject: RawSublimeSnippets = {
                snippet: {
                    content: {
                        _: `<FORCEDATA>\n${escapeSpecialCharacters(prettifyHTML(isArray(body) ? body.join('\n') : body))}\n</FORCEDATA>`,
                        $: {}
                    }
                }
            };

            xmlObject.snippet.tabTrigger = prefix ?? "";
            xmlObject.snippet.description = description ?? "No description provided";
            xmlObject.snippet.scope = "#{NULL}";

            const snippetOBJ = (builder.buildObject(xmlObject))
                .replace(/#{\s*NULL\s*}/g, "")
                .replace("CDATA[", "CDATA[\n")
                .replace("]]>", "\n]]>")
                .replace(/<FORCEDATA>\n/g, "")
                .replace(/\n<\/FORCEDATA>/g, "");

            return `#{NAME:${name}}${snippetOBJ}`;
        } catch (error: any) {
            throw new Error(`Error converting parsed snippet to Sublime XML snippet: ${error.message}`);
        }
    }
}

export default Sublime;
