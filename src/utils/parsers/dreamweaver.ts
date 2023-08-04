import { Parser } from 'xml2js';
import { readFileSync } from 'fs';
import { DreamweaverSnippet, DreamweaverSnippetContent, ParsedSnippet } from '@interfaces';
import { prettifyHTML, trimArray } from '../helpers';

/**
 * Represents a utility class for working with Dreamweaver snippets.
 */
class Dreamweaver {
    /**
     * Parses a Dreamweaver snippet XML string and returns a parsed snippet object.
     * @param snippet - The Dreamweaver snippet XML string.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error parsing the Dreamweaver snippet XML.
     */
    static parse(snippet: string): ParsedSnippet {
        const parser = new Parser();
        const parsedSnippet: ParsedSnippet = { body: [], scope: '' };

        try {
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

        } catch (err: any) {
            throw new Error('Failed to parse Dreamweaver snippet XML: ' + err.message);
        }

        return parsedSnippet;
    }

    /**
     * Parses a Dreamweaver snippet XML file and returns a parsed snippet object.
     * @param filePath - The path to the Dreamweaver snippet XML file.
     * @returns A parsed snippet object.
     * @throws {Error} If there is an error reading the file or parsing the Dreamweaver snippet XML.
     */
    static parseFile(filePath: string): ParsedSnippet {
        const content = readFileSync(filePath, 'utf-8');
        return Dreamweaver.parse(content);
    }

    /**
     * Converts a parsed snippet object into a Dreamweaver snippet XML string.
     * @param snippet - A parsed snippet object.
     * @returns A Dreamweaver snippet XML string.
     */
    static stringify(snippet: ParsedSnippet): string {
        const { name, description, prefix, body } = snippet;
        const insertTextElements = `    <insertText location="beforeSelection"> 
            <![CDATA[ 
${prettifyHTML(body.join(''))}
            ]]>
        </insertText>
        <insertText location="afterSelection">
            <![CDATA[]]>
        </insertText>`;

        return `<?xml version="1.0" encoding="utf-8"?>
    <snippet name="${name}" description="${description}" preview="${prefix}" type="block">
    ${insertTextElements}
    </snippet>`;
    }
}

export default Dreamweaver;
