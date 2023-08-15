import { ParsedSnippet } from "../../types/types";
declare class Atom {
    private static getSources;
    private static parseParsedCSON;
    static isSnippet(filePathOrString: string): Promise<boolean>;
    static parseFile(filePath: string): Promise<ParsedSnippet[]>;
    static parse(csonContent: string): Promise<ParsedSnippet[]>;
    static stringify(snippets: ParsedSnippet[]): Promise<string>;
}
export default Atom;
