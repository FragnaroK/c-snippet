import { ParsedSnippet } from '../../types/types';
declare class VSCODE {
    static isSnippet(filePathOrString: string): Promise<boolean>;
    static parseFile(filePath: string): Promise<ParsedSnippet[]>;
    static parse(json: string): Promise<ParsedSnippet[]>;
    static stringify(snippets: ParsedSnippet[]): Promise<string>;
}
export default VSCODE;
