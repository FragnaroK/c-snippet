import { ParsedSnippet, ParserType } from '../types/types';
import Converter from '../converter';
/**
 * Retrieves snippets from a directory or file.
 * @param {ParserType} editor - The editor type.
 * @param {string} path - Path to the snippets.
 * @returns Snippets data.
 */
declare function getSnippets(editor: ParserType, path: string): Promise<[string[], string[], number] | [string, string, number]>;
/**
 * Parses snippets using the specified editor.
 * @param {string} snippets - Snippets to parse.
 * @param {ParserType} editor - The editor type.
 * @returns Parsed snippets and converter instance.
 */
declare function parseSnippets(snippets: string | string[], editor: ParserType): Promise<[ParsedSnippet[], Converter]>;
/**
 * Converts snippets for multiple editors.
 * @param {Converter} converterInstance - Converter instance.
 * @param {ParsedSnippet[]} snippets - Parsed snippets.
 * @param {ParserType[]} editors - Editors to convert to.
 * @returns Converted snippets for each editor.
 */
declare function convertSnippet(converterInstance: Converter, snippets: ParsedSnippet[], editors: ParserType[]): Promise<{
    editor: ParserType;
    snippets: string;
}[]>;
/**
 * Saves converted snippet to a file or directory.
 * @param {string} snippet - Snippet content.
 * @param {string} output - Output directory or file.
 * @param {ParserType} editor - The editor type.
 */
declare function saveSnippet(snippet: string, output: string, editor: ParserType): Promise<void>;
export { getSnippets, parseSnippets, convertSnippet, saveSnippet };
