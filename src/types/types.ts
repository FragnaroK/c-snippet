export interface ParsedSnippet {
    name?: string;
    description?: string;
    prefix?: string;
    body: string[];
    scope?: string;
}

export interface VSCodeSnippet {
    name?: string;
    description?: string;
    prefix?: string;
    body: string[];
    scope?: string;
}

export interface RawSublimeSnippets {
    snippet: { 
        content: {
            _: string;
            $: {
                [key: string]: string;
            };
        };
        tabTrigger?: string;
        description?: string;
        scope?: string;
    }
}

export interface SublimeSnippet {
    name?: string;
    description?: string;
    tabTrigger?: string;
    content?: string;
    scope?: string;
}

export interface RawAtomSnippets {
    [key: string]: {
        [key: string]: {
            prefix?: string;
            body: string;
        };
    };
}

export interface AtomSnippet {
    snippet: {
        [key: string]: {
            prefix?: string;
            body: string;
        };
    }
    scope?: string;
}


export type DreamweaverSnippetContent = {
    $: {
        name?: string;
        description?: string;
        preview?: string;
        type?: string;
    };
    insertText?: {
        $: {
            location: "beforeSelection" | "afterSelection";
        };
        _: string;
    }[];
}

export interface DreamweaverSnippet {
    snippet: DreamweaverSnippetContent;
}

export interface ParserInterface {
    parseFile(filePath: string): Promise<ParsedSnippet[]>;
    parse(source: string): Promise<ParsedSnippet[]>;
    stringify(snippets: ParsedSnippet[]): string;
    [key: string]: any;
}

export type ParserType = 'vscode' | 'sublime' | 'atom' | 'dreamweaver' | undefined;

export interface ConverterInterface {
    source?: ParserType;
    parsers: any;
    snippets: string;
    init(): Promise<ConverterInterface>;
    findSource(): Promise<ParserType>;
    parse(source?: string): Promise<ParsedSnippet[]>;
    convert(snippet?: ParsedSnippet[]): Promise<string>;
}

export interface WriteOptions {
    filepath: string;
    filename: string;
    overwrite?: boolean;
    content: string;
    [key: string]: any;
}

export interface CliArgs {
    fromEditor: ParserType;
    toEditor: ParserType | ParserType[];
    snippetsPath: string;
    outputPath: string;
}