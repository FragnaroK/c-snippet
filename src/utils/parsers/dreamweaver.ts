import { Parser } from 'xml2js';
import { readFileSync } from 'fs';
import { DreamweaverSnippet, DreamweaverSnippetContent, ParsedSnippet } from '@interfaces';
import { prettifyHTML, trimArray } from '../helpers';

class Dreamweaver {
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

    static parseFile(filePath: string): ParsedSnippet {
        const content = readFileSync(filePath, 'utf-8');
        return Dreamweaver.parse(content);
    }

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
