import Utils from './utils/utils';
import { ConverterInterface, ParsedSnippet, ParserType } from './types/types';
declare class Converter implements ConverterInterface {
    source?: ParserType;
    target?: ParserType;
    parsers: Record<string, typeof Utils.VSCODE | typeof Utils.SUBLIME | typeof Utils.DREAMWEAVER | typeof Utils.ATOM>;
    snippets: string;
    constructor(snippets: string, target?: ParserType, source?: ParserType);
    private static getSnippetName;
    init(): Promise<ConverterInterface>;
    findSource(): Promise<ParserType>;
    parse(source?: ParserType): Promise<ParsedSnippet[]>;
    convert(snippet?: ParsedSnippet[], to?: ParserType): Promise<string>;
}
export default Converter;
