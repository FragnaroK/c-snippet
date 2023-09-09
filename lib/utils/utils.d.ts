declare const Utils: {
    spinner: import("ora").Ora;
    getFiles: typeof import("./fileManager").getFiles;
    readFile: typeof import("./fileManager").readFile;
    readFiles: typeof import("./fileManager").readFiles;
    writeFile: typeof import("./fileManager").writeFile;
    writeFiles: typeof import("./fileManager").writeFiles;
    isDir: typeof import("./fileManager").isDir;
    ATOM: typeof import("./parsers/atom").default;
    DREAMWEAVER: typeof import("./parsers/dreamweaver").default;
    VSCODE: typeof import("./parsers/vscode").default;
    SUBLIME: typeof import("./parsers/sublime").default;
    addKeysToObject: typeof import("./helpers").addKeysToObject;
    trimArray: typeof import("./helpers").trimArray;
    prettifyHTML: typeof import("./helpers").prettifyHTML;
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
    sleep: typeof import("./helpers").sleep;
    isMultipleFile: typeof import("./helpers").isMultipleFile;
    errorHandler: typeof import("./helpers").errorHandler;
    isArray: (value: any) => value is any[];
    blank: (lines?: number) => Promise<void>;
    getSnippetName: typeof import("./helpers").getSnippetName;
    getFileExtension: typeof import("./helpers").getFileExtension;
    escapeSpecialCharacters: typeof import("./helpers").escapeSpecialCharacters;
};
export default Utils;
