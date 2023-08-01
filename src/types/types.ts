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

export interface SublimeSnippet {
    name?: string;
    description?: string;
    tabTrigger?: string;
    content?: string;
    scope?: string;
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

export interface DreamweaverSnippet {
    name?: string;
    shortcut?: string;
    code: string;
    description?: string;
    scope?: string;
}