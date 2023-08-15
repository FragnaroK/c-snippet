import { ParserType } from 'src/types/types';
export declare const parser_variables: {
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
export declare function sleep(ms: number): Promise<void>;
export declare const blank: (lines?: number) => Promise<void>;
export declare function isMultipleFile(editor: ParserType): boolean;
export declare function getSnippetName(snippet: string): {
    cleanName: string;
    filteredSnippet: string;
};
export declare function getFileExtension(editor: ParserType): ".code-snippets" | ".sublime-snippet" | ".cson" | ".csn";
export declare const isArray: (value: any) => value is any[];
export declare function errorHandler(error: Error, msg?: string): void;
export declare function addKeysToObject(data: Array<any>, target: any): any;
export declare function trimArray(array: Array<string>, deep?: boolean): Array<string>;
export declare function prettifyHTML(html: string): string;
declare const _default: {
    addKeysToObject: typeof addKeysToObject;
    trimArray: typeof trimArray;
    prettifyHTML: typeof prettifyHTML;
    parser_variables: {
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
};
export default _default;
