import { Parser, Builder } from 'xml2js';
import { readFileSync } from 'fs';
import { DreamweaverSnippet, DreamweaverSnippetContent, ParsedSnippet } from "../types/types";
import { escapeSpecialCharacters, isArray, prettifyHTML, trimArray } from '../utils/helpers';

/**
 * Represents a utility class for working with Dreamweaver snippets.
 */
class Dreamweaver {


    /**
     * Checks if the given file path or string is an Dreamweaver snippet file.
     * @param filePathOrString - The file path or string to check.
     * @returns `true` if the given file path or string is a Dreamweaver snippet file, otherwise `false`.
     * @throws {Error} If there is an error reading the file or parsing the CSN.
     * 
     */
    public static async isSnippet(filePathOrString: string): Promise<boolean> {

        const isCSN = await Promise.resolve(filePathOrString.endsWith('.csn'));
        const isCorrectFormat = await Dreamweaver.parse(filePathOrString).then((snippet) => snippet.prefix !== undefined && snippet.body !== undefined);

        return await Promise.all([isCSN, isCorrectFormat]).then((values) => values.some((value) => value === true));
    }

    /**
     * Parses a Dreamweaver snippet XML file and returns a parsed snippet object.
     * @param filePath - The path to the Dreamweaver snippet XML file.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error reading the file or parsing the Dreamweaver snippet XML.
     */
    public static async parseFile(filePath: string): Promise<ParsedSnippet> {
        try {
            const data = readFileSync(filePath, 'utf-8');
            return Dreamweaver.parse(data);
        } catch (err: any) {
            throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
        }
    }

    /**
     * Parses a Dreamweaver snippet XML string and returns a parsed snippet object.
     * @param snippet - The Dreamweaver snippet XML string.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error parsing the Dreamweaver snippet XML.
     */
    public static async parse(snippet: string): Promise<ParsedSnippet> {
        try {
            const parser = new Parser();
            const parsedSnippet: ParsedSnippet = { body: [], scope: '' };

            parser.parseString(snippet, (err, res) => {
                const result: DreamweaverSnippet = res;
                const snippetElement: DreamweaverSnippetContent = result.snippet;

                parsedSnippet.name = snippetElement.$.name;
                parsedSnippet.description = snippetElement.$.description;
                parsedSnippet.prefix = snippetElement.$.preview;

                for (const insertText of snippetElement.insertText ?? []) {
                    if (insertText._) {
                        parsedSnippet.body = trimArray(insertText._.split('\n'));
                    }
                }
                if (err) {
                    throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
                }
            });

            return parsedSnippet;

        } catch (err: any) {
            throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
        }
    }


    /**
     * Converts a parsed snippet object into a Dreamweaver snippet XML string.
     * @param snippet - A parsed snippet object.
     * @returns A Dreamweaver snippet XML string.
     */
    public static async stringify(snippet: ParsedSnippet): Promise<string> {
        try {
            const builder = new Builder({
                renderOpts: { 'pretty': true, 'newline': '\n', 'indent': '' },
                cdata: true,
                xmldec: { 'version': '1.0', 'encoding': 'utf-8' },

            });

            const { name, description, prefix, body } = snippet;


            // <FORCEDATA> is a workaround to force xml2js to render CDATA
            // ? Could be improved by using a custom render function

            const insertTextElements: DreamweaverSnippet = {
                snippet: {
                    $: {
                        name,
                        description,
                        preview: prefix,
                        type: 'block'
                    },
                    insertText: [
                        {
                            $: {
                                location: 'beforeSelection'
                            },
                            _: `<FORCEDATA>\n${escapeSpecialCharacters(prettifyHTML(isArray(body) ? body.join('\n') : body))}\n</FORCEDATA>`
                        },
                        {
                            $: {
                                location: 'afterSelection'
                            },
                            _: '#{NULL}'
                        }
                    ]
                }
            };

            const snippetOBJ = builder.buildObject(insertTextElements)
                .replace(/#{\s*NULL\s*}/g, "")
                .replace("<![CDATA[", "\n<![CDATA[\n")
                .replace("]]>", "\n]]>\n")
                .replace(/<FORCEDATA>\n/g, "")
                .replace(/\n<\/FORCEDATA>/g, "");

            return `#{NAME:${name}}${snippetOBJ}`
        } catch (err: any) {
            throw new Error('Failed to convert parsed snippet to Dreamweaver snippet XML: ' + err.message);
        }
    }
}

export default Dreamweaver;
