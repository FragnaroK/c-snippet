import { Parser } from 'htmlparser2';
import { ParserType } from 'src/types/types';

export const parser_variables = {
    divider: '#{DIVIDER}',
    tabstop: '#{TABSTOP}',
    placeholder: '#{PLACEHOLDER}',
    escape: '#{ESCAPE}',
    comment: '#{COMMENT}',
    variable: '#{VARIABLE}',
    null: '#{NULL}',
    undefined: '#{UNDEFINED}',
    snippetName: {
        start: '#{NAME:',
        end: '}'
    },
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const blank = async (lines: number = 1): Promise<void> => Promise.resolve(console.log('\n'.repeat(lines)))


export function isMultipleFile(editor: ParserType) {
    if (editor === "sublime" || editor === "dreamweaver") return true;
    return false;
}

export function getSnippetName(snippet: string) {
    const { start, end } = parser_variables.snippetName
    // get snippet name inside #{NAME: ...} using regExp
    const regex = /#{NAME:\s*(.*?)\s*}/;
    const match = regex.exec(snippet);
    const name = match && match[1] ? match[1] : "No Name";

    const filteredSnippet = snippet.replace(`${start}${name}${end}`, "");
    const cleanName = name.trim().replace(/\s/g, "-");
    return { cleanName, filteredSnippet };
}

export function getFileExtension(editor: ParserType) {
    switch (editor) {
        case 'vscode': return ".code-snippets"
        case 'sublime': return ".sublime-snippet"
        case 'atom': return ".cson"
        case 'dreamweaver': return ".csn"
    }
}

export const isArray = (value: any): value is any[] => Array.isArray(value);

export function errorHandler(error: Error, msg?: string): void {
    console.error(msg ?? "", error);
    process.exit(1);
}

/**
 *  Adds keys from an array of objects to a target object.
 * @param data - An array of objects.
 * @param target - The target object.
 * @returns The target object with the keys added.
 * @example
 * const data = [
 *    { name: 'John', age: 21 },
 *   { name: 'Jane', age: 22 },
 * ];
 * const target = { name: '', age: '' };
 * const result = addKeysToObject(data, target);
 * console.log(result);
 * // { name: { John: '', Jane: '' }, age: { 21: '', 22: '' } }
 * 
 */
export function addKeysToObject(data: Array<any>, target: any): any {
    data.forEach((item) => {
        for (const key in item) {
            if (key in target) {
                target[key] = { ...target[key], ...item[key] };
            } else {
                target[key] = { ...item[key] };
            }
        }
    });

    return target;
}

/**
 * Trims an array of strings.
 * @param array - An array of strings.
 * @returns An array of trimmed strings.
 * @example
 * const array = ['  Hello  ', '  World  '];
 * const result = trimArray(array);
 * console.log(result);
 * // ['Hello', 'World']
 * 
 */
export function trimArray(array: Array<string>, deep: boolean = false): Array<string> {
    if (!deep) return array.map((line) => line.trim()).filter((item) => item !== '');
    return array.map((line) => line.trim()).filter((item) => item !== '').map((line) => {
        return line.split('').filter((char) => char !== '\t').join('');
    });
}

/**
 * Prettifies an HTML string.
 * @param html - An HTML string.
 * @returns A prettified HTML string.
 * @example
 * const html = '<p>Hello</p><p>World</p>';
 * const result = prettifyHTML(html);
 * console.log(result);
 * // <p>
 * //     Hello
 * // </p>
 * // <p>
 * //     World
 * // </p>
 * 
 */
export function prettifyHTML(html: string): string {
    let output = '';
    let indentLevel = 1;

    const parser = new Parser({
        onopentag(name, attribs) {
            indentLevel++;

            output += `${'\t'.repeat(indentLevel)}<${name}`;
            for (const key in attribs) {
                output += ` ${key}="${attribs[key]}"`;
            }

            if (name === 'br') {
                output += '\n';
            } else if (name === 'pre') {
                indentLevel = 0;
            } else if (name === 'code') {
                indentLevel = 0;
            } else if (name === 'p') {
                output += '>';
            } else {
                output += '>\n';
            }

        },
        ontext(text) {
            indentLevel++;
            output += text.trim();
        },
        onclosetag(tagname) {
            indentLevel--;

            if (tagname === 'pre' || tagname === 'code') {
                indentLevel = 1;
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;


            } else if (tagname === 'p') {
                output += `</${tagname}>\n`;
            } else {
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;
            }

        },
    }, { decodeEntities: true });

    parser.write(html);
    parser.end();

    return output; // Remove any trailing whitespace
}



export default {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parser_variables,
    sleep,
    isMultipleFile,
    errorHandler,
    isArray,
    blank,
    getSnippetName,
    getFileExtension
};