import { ParserType } from 'src/types/types';
/**
 * Constants for parser variables.
 */
export declare const parserVariables: {
    divider: string;
    tabstop: string;
    placeholder: string;
    escape: string;
    comment: string;
    variable: string;
    null: string;
    undefined: string;
    snippetName: {
        start: string;
        end: string;
    };
};
/**
 * @param {string} input - The input string.
 * @param {number} times - The number of times to repeat the string.
 * @returns {string} - The escaped string.
 */
export declare function escapeSpecialCharacters(input: string, times?: number): string;
/**
 * Asynchronously sleeps for a given time in milliseconds.
 * @param ms - Time in milliseconds to sleep.
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Prints blank lines to the console.
 * @param lines - Number of blank lines to print (default is 1).
 */
export declare const blank: (lines?: number) => Promise<void>;
/**
 * Checks if the editor is capable of handling multiple files.
 * @param editor - The editor type.
 * @returns Whether the editor supports multiple files.
 */
export declare function isMultipleFile(editor: ParserType): boolean;
/**
 * Extracts the snippet name from a snippet text.
 * @param snippet - The snippet text.
 * @returns Object containing the clean name and the filtered snippet.
 */
export declare function getSnippetName(snippet: string): {
    cleanName: string;
    filteredSnippet: string;
};
/**
 * Retrieves the file extension based on the editor type.
 * @param editor - The editor type.
 * @returns The file extension.
 */
export declare function getFileExtension(editor: ParserType): string;
/**
 * Checks if a value is an array.
 * @param value - The value to check.
 * @returns Whether the value is an array.
 */
export declare const isArray: (value: any) => value is any[];
/**
 * Handles errors by logging them to the console and exiting the process.
 * @param error - The error object.
 * @param msg - Optional error message.
 */
export declare function errorHandler(error: Error, msg?: string): void;
/**
 * Adds keys from an array of objects to a target object.
 * @param data - An array of objects.
 * @param target - The target object.
 * @returns The target object with the keys added.
 */
export declare function addKeysToObject(data: Record<string, any>[], target: Record<string, any>): Record<string, any>;
/**
 * Trims an array of strings.
 * @param array - An array of strings.
 * @param deep - Whether to perform deep trimming (removing tabs).
 * @returns An array of trimmed strings.
 */
export declare function trimArray(array: string[], deep?: boolean): string[];
/**
 * Prettifies an HTML string.
 * @param html - An HTML string.
 * @returns A prettified HTML string.
 */
export declare function prettifyHTML(html: string): string;
declare const _default: {
    addKeysToObject: typeof addKeysToObject;
    trimArray: typeof trimArray;
    prettifyHTML: typeof prettifyHTML;
    parserVariables: {
        divider: string;
        tabstop: string;
        placeholder: string;
        escape: string;
        comment: string;
        variable: string;
        null: string;
        undefined: string;
        snippetName: {
            start: string;
            end: string;
        };
    };
    sleep: typeof sleep;
    isMultipleFile: typeof isMultipleFile;
    errorHandler: typeof errorHandler;
    isArray: (value: any) => value is any[];
    blank: (lines?: number) => Promise<void>;
    getSnippetName: typeof getSnippetName;
    getFileExtension: typeof getFileExtension;
    escapeSpecialCharacters: typeof escapeSpecialCharacters;
};
export default _default;
