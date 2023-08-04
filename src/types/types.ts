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