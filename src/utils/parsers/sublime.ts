import { ParsedSnippet, RawSublimeSnippets } from '@interfaces';
import { readFile } from 'fs/promises';
import { Parser, Builder } from 'xml2js';
import { prettifyHTML, trimArray } from '../helpers';

/**
 * A utility class for parsing and stringifying Sublime Text snippets.
 */
class SublimeSnippetParser {
    /**
     * Parses a Sublime Text snippet file asynchronously and returns a parsed snippet object.
     * @param {string} snippetPath - The path to the Sublime Text snippet file.
     * @returns {Promise<ParsedSnippet>} - A promise that resolves to the parsed snippet object.
     * @throws {Error} - Throws an error if there's an issue reading or parsing the snippet file.
     */
    static async parseFile(snippetPath: string): Promise<ParsedSnippet> {
        try {
            const data = await readFile(snippetPath, 'utf-8');
            return SublimeSnippetParser.parse(data, snippetPath.slice(snippetPath.lastIndexOf('/') + 1));
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
    static parse(snippet: string, name: string): ParsedSnippet {
        const parser = new Parser();
        const parsedSnippet: ParsedSnippet = { body: [], scope: '' };
        try {
            parser.parseString(snippet, (err, res) => {
                if (err) {
                    throw new Error(`Error parsing Sublime Text snippet: ${err.message}`);
                    return;
                }
                const snippetElement = res.snippet;
                parsedSnippet.name = name;
                parsedSnippet.description = snippetElement.description[0];
                parsedSnippet.prefix = snippetElement.tabTrigger[0];
                parsedSnippet.body = trimArray(snippetElement.content?.[0].split('\n')) || [];
                parsedSnippet.scope = snippetElement.scope[0]; 

            }); 
        } catch (error: any) {
            throw new Error(`Error parsing Sublime Text snippet: ${error.message}`);
        }
        return parsedSnippet;

    }

    /**
     * Converts a parsed snippet object to a formatted XML string for Sublime Text.
     * @param {ParsedSnippet} parsedSnippet - The parsed snippet object to be converted.
     * @returns {string} - A formatted XML string representing the Sublime Text snippet.
     * @throws {Error} - Throws an error if there's an issue converting the parsed snippet object.
     * @see {@link https://www.sublimetext.com/docs/3/snippets.html|Sublime Text Snippets}
     *
     */
    static stringify(parsedSnippet: ParsedSnippet): string {
        const builder = new Builder({
            headless: true,
            renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
            cdata: true,
            xmldec: { 'version': '1.0', 'encoding': 'UTF-8' },

        }); 

        const xmlObject: RawSublimeSnippets = {
            snippet: {
                content: {
                    _: prettifyHTML(parsedSnippet.body.join('')),
                    $: {  }
                }
            }
        };

        // TODO : Add name to sublime snippet file
        // if (parsedSnippet.name) {
        //     xmlObject.snippet.name = parsedSnippet.name;
        // }
        xmlObject.snippet.tabTrigger =  parsedSnippet.prefix?? ""; 
        xmlObject.snippet.description = parsedSnippet.description?? "No description provided";
        xmlObject.snippet.scope = "#{NULL}" ;

        const snippetOBJ = (builder.buildObject(xmlObject))
        .replace(/#{\s*NULL\s*}/g, "")
        .replace("CDATA[", "CDATA[\n");

        return snippetOBJ;
    }
}

export default SublimeSnippetParser;
