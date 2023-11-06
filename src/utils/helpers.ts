import chalk from 'chalk';
import { Parser } from 'htmlparser2';
import { ParserType } from 'src/types/types';
import { _CLI } from './constants';
import Logger from 'node-logger-cli';

const log = new Logger("Utils", process.env.NODE_ENV === "development");

/**
 * Constants for parser variables.
 */
export const parserVariables = {
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
};


/**
 * @param {string} input - The input string.
 * @param {number} times - The number of times to repeat the string.
 * @returns {string} - The escaped string.
 */
export function escapeSpecialCharacters(input: string, times: number = 1): string {
    let escapeText = input;
    log.d("Escaping special characters", { input, times });
    for (let i = 0; i < times; i++) {
        escapeText = escapeText.replace(/[*+?^${}|[\]\\]/g, '\\$&');
    }
    
    log.d("Escaped special characters", { escapeText });
    return escapeText;
}

/**
 * Asynchronously sleeps for a given time in milliseconds.
 * @param ms - Time in milliseconds to sleep.
 */
export async function sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Prints blank lines to the console.
 * @param lines - Number of blank lines to print (default is 1).
 */
export const blank = async (lines: number = 1): Promise<void> => {
    await Promise.resolve(console.log('\n'.repeat(lines)));
};

/**
 * Checks if the editor is capable of handling multiple files.
 * @param editor - The editor type.
 * @returns Whether the editor supports multiple files.
 */
export function isMultipleFile(editor: ParserType): boolean {
    return editor === "sublime" || editor === "dreamweaver";
}

/**
 * Extracts the snippet name from a snippet text.
 * @param snippet - The snippet text.
 * @returns Object containing the clean name and the filtered snippet.
 */
export function getSnippetName(snippet: string): { cleanName: string; filteredSnippet: string } {
    const { start, end } = parserVariables.snippetName;
    const regex = /#{NAME:\s*(.*?)\s*}/;
    const match = regex.exec(snippet);
    const name = match ? match[1] : "No Name";
    const filteredSnippet = snippet.replace(`${start}${name}${end}`, "");
    const cleanName = name.trim().replace(/\s/g, "-");
    return { cleanName, filteredSnippet };
}

/**
 * Retrieves the file extension based on the editor type.
 * @param editor - The editor type.
 * @returns The file extension.
 */
export function getFileExtension(editor: ParserType): string {
    switch (editor) {
        case 'vscode': return ".code-snippets";
        case 'sublime': return ".sublime-snippet";
        case 'atom': return ".cson";
        case 'dreamweaver': return ".csn";
        default: return "";
    }
}

/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array.
 */
export const isArray = (value: any): value is any[] => Array.isArray(value);

/**
 * Handles errors by logging them to the console and exiting the process.
 * @param error - The error object.
 * @param msg - Optional error message.
 */
export function errorHandler(error: Error, msg?: string): void {
    const regex = /(error:|Error:)/g;
    const parsedErrorStack = error.stack?.split(regex).map((item, i) => `${chalk.dim(".".repeat(i))}${chalk.dim(item.trim())}`).join("\n");

    log.e("Error", { error, msg, parsedErrorStack });
    console.error(
        msg ?? "❌ ERROR",
        `\n${'🔻'.repeat(_CLI.width / 2)}\n`,
        chalk.redBright(error.message ? `\n${error.message}` : "No error message available"),
        parsedErrorStack ? `\n${parsedErrorStack}` : "No stack trace available",        
        );
    process.exit(1);
}

/**
 * Adds keys from an array of objects to a target object.
 * @param data - An array of objects.
 * @param target - The target object.
 * @returns The target object with the keys added.
 */
export function addKeysToObject(data: Record<string, any>[], target: Record<string, any>): Record<string, any> {
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
 * @param deep - Whether to perform deep trimming (removing tabs).
 * @returns An array of trimmed strings.
 */
export function trimArray(array: string[]): string[] {
    const spacesRegexp = /^\s*$/;
    const trimmedArray: string[] = array.map((item) => item.trim()).filter((item) => item !== "" && !spacesRegexp.test(item));
    return trimmedArray;
}

/**
 * Prettifies an HTML string.
 * @param html - An HTML string.
 * @returns A prettified HTML string.
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
            } else if (name === 'pre' || name === 'code') {
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

    return output.trim();
}

export default {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parserVariables,
    sleep,
    isMultipleFile,
    errorHandler,
    isArray,
    blank,
    getSnippetName,
    getFileExtension,
    escapeSpecialCharacters,
};
