import * as fs from 'fs';
import { parse, stringify } from 'cson-parser';
import { ParsedSnippet } from "@interfaces"
import { addKeysToObject } from '../helpers';


const getSources = (parsedCSON: any): string[] => {
    return Object.keys(parsedCSON).filter((key) => key.startsWith('.source'));
};

const getSourcesFromObject = (parsedCSON: ParsedSnippet[]): string[] => {
    return parsedCSON.map((snippet) => snippet.scope ?? '*');
}

const parseFile = (filePath: string): Promise<ParsedSnippet> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, csonContent) => {
            if (err) {
                reject(`Error reading file: ${err.message}`);
            } else {
                try {
                    const parsedObject = parse(csonContent);
                    resolve(parsedObject);
                } catch (parseError: any) {
                    reject(`Error parsing CSON content: ${parseError.message}`);
                }
            }
        });
    });
};

const parseString = (csonContent: string): ParsedSnippet[] => {
    const parsedCSON = parse(csonContent);
    const sources = getSources(parsedCSON);
    const parsedSnippets: ParsedSnippet[] = [];

    sources.forEach((source) => {
        const snippets = parsedCSON[source];
        Object.keys(snippets).forEach((key) => {
            const snippet = snippets[key];
            const parsedSnippet: ParsedSnippet = {
                name: key,
                description: snippet.description ?? "No description provided",
                prefix: snippet.prefix,
                body: snippet.body.split('\n'),
                scope: source,
            };
            parsedSnippets.push(parsedSnippet);
        });
    });

    return parsedSnippets;
};

const stringifySnippet = (snippets: ParsedSnippet[]): string => {
    // TODO : Add support for multiple sources
    // const sources = getSourcesFromObject(snippets);

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
};

const CSON = {
    parseFile,
    parseString,
    stringifySnippet,
}

export default CSON;