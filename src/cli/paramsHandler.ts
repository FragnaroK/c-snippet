import { ParsedSnippet, ParserType } from '../types/types';
import Utils from '../utils/utils';
import Converter from '../converter';
import fm from '../utils/fileManager';
import CSON from 'cson-parser';

const {
    isDir,
    isMultipleFile,
    isArray,
    parserVariables,
    getSnippetName,
    getFileExtension
} = Utils;

/**
 * Retrieves snippets from a directory or file.
 * @param {ParserType} editor - The editor type.
 * @param {string} path - Path to the snippets.
 * @returns Snippets data.
 */
async function getSnippets(editor: ParserType, path: string): Promise<[string[], string[], number] | [string, string, number]> {
    try {
        if (await isDir(path)) {
            if (isMultipleFile(editor)) {
                const files = await fm.getFiles(path);
                const snippets = await Promise.all(files.map(async (file) => await fm.readFile(file)));
                return [snippets, files, files.length];
            } else {
                const snippets = await fm.readFile(path);
                const parsedSnippets = snippets.startsWith('{') ? Object.keys(JSON.parse(snippets)) : Object.keys(CSON.parse(snippets));
                return [[snippets], parsedSnippets, parsedSnippets.length];
            }
        }
        throw new Error('Invalid directory or file');
    } catch (error) {
        throw new Error('Error while reading snippets' + error);
    }
}

/**
 * Parses snippets using the specified editor.
 * @param {string} snippets - Snippets to parse.
 * @param {ParserType} editor - The editor type.
 * @returns Parsed snippets and converter instance.
 */
async function parseSnippets(snippets: string | string[], editor: ParserType): Promise<[ParsedSnippet[], Converter]> {
    try {
        const converter = new Converter(isArray(snippets) ? snippets.join(parserVariables.divider) : snippets);
        const parsedSnippets: ParsedSnippet[] = await converter.parse(editor);
        return [parsedSnippets, converter];
    } catch (error) {
        throw new Error('Error while parsing snippets' + error);
    }
}

/**
 * Converts snippets for multiple editors.
 * @param {Converter} converterInstance - Converter instance.
 * @param {ParsedSnippet[]} snippets - Parsed snippets.
 * @param {ParserType[]} editors - Editors to convert to.
 * @returns Converted snippets for each editor.
 */
async function convertSnippet(converterInstance: Converter, snippets: ParsedSnippet[], editors: ParserType[]): Promise<{
    editor: ParserType,
    snippets: string
}[]> {
    try {
        const convertedSnippets = await Promise.all(editors.map(async (editor) => {
            return {
                editor,
                snippets: await converterInstance.convert(snippets, editor)
            };
        }));

        return convertedSnippets;
    } catch (error) {
        throw new Error('Error while converting snippet' + error);
    }
}

/**
 * Saves converted snippet to a file or directory.
 * @param {string} snippet - Snippet content.
 * @param {string} output - Output directory or file.
 * @param {ParserType} editor - The editor type.
 */
async function saveSnippet(snippet: string, output: string, editor: ParserType) {
    try {
        let filesContent = [];
        if (isMultipleFile(editor)) {
            filesContent = snippet.split(parserVariables.divider).map((snip) => {
                const { cleanName, filteredSnippet } = getSnippetName(snip);
                return {
                    name: cleanName,
                    snippet: filteredSnippet
                };
            });
            await fm.writeFiles(filesContent.map((file) => ({
                content: file.snippet,
                filename: `${file.name}${getFileExtension(editor)}`,
                filepath: output,
                overwrite: true,
            })));
        } else {
            await fm.writeFile({
                content: snippet,
                filename: `snippets${getFileExtension(editor)}`,
                filepath: output,
                overwrite: true,
            });
        }
    } catch (error) {
        throw new Error('Error while saving snippet' + error);
    }
}

export {
    getSnippets,
    parseSnippets,
    convertSnippet,
    saveSnippet
};