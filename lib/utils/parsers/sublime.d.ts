import { ParsedSnippet } from '../../types/types';
declare class Sublime {
    static isSnippet(filePathOrString: string, name: string): Promise<boolean>;
    static parseFile(snippetPath: string): Promise<ParsedSnippet>;
    static parse(snippet: string, name: string): Promise<ParsedSnippet>;
    static stringify(parsedSnippet: ParsedSnippet): Promise<string>;
}
export default Sublime;
