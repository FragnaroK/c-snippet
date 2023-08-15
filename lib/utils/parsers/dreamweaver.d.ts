import { ParsedSnippet } from '../../types/types';
declare class Dreamweaver {
    static isSnippet(filePathOrString: string): Promise<boolean>;
    static parseFile(filePath: string): Promise<ParsedSnippet>;
    static parse(snippet: string): Promise<ParsedSnippet>;
    static stringify(snippet: ParsedSnippet): Promise<string>;
}
export default Dreamweaver;
