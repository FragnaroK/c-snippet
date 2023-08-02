import * as xml2js from 'xml2js';
import { readFileSync } from 'fs';
import { DreamweaverSnippet, DreamweaverSnippetContent, ParsedSnippet } from '@interfaces';
import { prettifyHTML, trimArray } from '../helpers';


function parseFile(filePath: string): ParsedSnippet {
    const content = readFileSync(filePath, 'utf-8');
    const snippets: ParsedSnippet = parse(content);
    return snippets;
}

function parse(snippet: string): ParsedSnippet {
    const parser = new xml2js.Parser();
    const parsedSnippet: ParsedSnippet = { body: [], scope: '' };

    parser.parseString(snippet, (err, result: DreamweaverSnippet) => {
        if (err) {
            throw err;
        }

        const snippetElement: DreamweaverSnippetContent = result.snippet;

        parsedSnippet.name = snippetElement.$.name;
        parsedSnippet.description = snippetElement.$.description;
        parsedSnippet.prefix = snippetElement.$.preview;

        if (snippetElement.insertText && snippetElement.insertText.length > 0) {
            for (const insertText of snippetElement.insertText) {
                if (insertText.$.location === 'beforeSelection' && insertText._) {
                    parsedSnippet.body = trimArray(insertText._.split('\n'));
                } else if (insertText.$.location === 'afterSelection' && insertText._) {
                    parsedSnippet.body = trimArray(insertText._.split('\n'));
                }
            }
        }
    });

    return parsedSnippet;
}


function stringify(snippet: ParsedSnippet): string {
    const { name, description, prefix, body, scope } = snippet;
    const insertTextElements = `    <insertText location="beforeSelection"> 
            <![CDATA[ 
${prettifyHTML(body.join(''))}
            ]]>
        </insertText>
        <insertText location="afterSelection">
            <![CDATA[]]>
        </insertText>`

    return `<?xml version="1.0" encoding="utf-8"?>
    <snippet name="${name}" description="${description}" preview="${prefix}" type="block">
    ${insertTextElements}
    </snippet>`;
}



const CSN = {
    parse,
    stringify,
    parseFile
}

export default CSN;
