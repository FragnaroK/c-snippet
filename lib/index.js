"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("./utils/utils"));
const prompts_1 = require("@inquirer/prompts");
const converter_1 = __importDefault(require("./converter"));
const constants_1 = require("./utils/constants");
const fileManager_1 = __importDefault(require("./utils/fileManager"));
const cson_parser_1 = __importDefault(require("cson-parser"));
const { isDir, sleep, isMultipleFile, errorHandler, isArray, spinner, parser_variables, blank, getSnippetName, getFileExtension } = utils_1.default;
const questions = {
    selection: {
        from_editor: {
            name: 'fromEditor',
            message: 'Which editor are you converting from?',
            choices: [
                { name: 'Dreamweaver', value: 'dreamweaver', description: "" },
                { name: 'Sublime', value: 'sublime', description: "" },
                { name: 'VS Code', value: 'vscode', description: "" },
                { name: 'Atom', value: 'atom', description: "" }
            ]
        },
        to_editor: {
            name: 'toEditor',
            message: 'Which editor are you converting to?',
            choices: [
                { name: 'Dreamweaver', value: 'dreamweaver', description: "" },
                { name: 'Sublime', value: 'sublime', description: "" },
                { name: 'VS Code', value: 'vscode', description: "" },
                { name: 'Atom', value: 'atom', description: "WARN: Snippets scope are going to be converted to global" }
            ]
        }
    },
    input: {
        snippets: (editor) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                name: 'snippets',
                message: `${isMultipleFile(editor) ? 'Directory' : 'File'} of the snippets to be converted'`,
                type: 'input',
                validate: (input) => __awaiter(void 0, void 0, void 0, function* () {
                    return (yield isDir(input)) ? true : 'Invalid directory or file';
                })
            });
        }),
        output: (editors) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                name: 'output',
                message: `${editors.every((editor) => __awaiter(void 0, void 0, void 0, function* () { return isMultipleFile(editor); })) ? 'Directory' : 'File'} where the converted snippets will be saved`,
                type: 'input',
                validate: (input) => __awaiter(void 0, void 0, void 0, function* () {
                    return (yield isDir(input)) ? true : 'Invalid directory or file';
                })
            });
        })
    }
};
function getParams() {
    return __awaiter(this, void 0, void 0, function* () {
        const { from_editor, to_editor } = questions.selection;
        const fromEditor = yield (0, prompts_1.select)(from_editor), toEditor = yield (0, prompts_1.checkbox)(to_editor);
        const { snippets, output } = questions.input;
        const snippetsPath = yield (0, prompts_1.input)(yield snippets(fromEditor)), outputPath = yield (0, prompts_1.input)(yield output(isArray(toEditor) ? toEditor : [toEditor]));
        return { fromEditor, toEditor, snippetsPath, outputPath };
    });
}
function getSnippets(editor, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield isDir(path)) {
                if (isMultipleFile(editor)) {
                    const files = yield fileManager_1.default.getFiles(path);
                    const snippets = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                        return yield fileManager_1.default.readFile(file);
                    }));
                    return yield Promise.all([yield Promise.all(snippets), files, files.length]);
                }
                else {
                    const snippets = yield fileManager_1.default.readFile(path);
                    const files = snippets.startsWith("{") ? Object.keys(JSON.parse(snippets)) : Object.keys(cson_parser_1.default.parse(snippets));
                    return [[snippets], files, files.length];
                }
            }
            throw new Error("Invalid directory or file");
        }
        catch (error) {
            throw new Error("Error while reading snippets" + error);
        }
    });
}
function parseSnippets(snippets, editor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const converter = new converter_1.default(isArray(snippets) ? snippets.join(parser_variables.divider) : snippets);
            let parsedSnippets = yield converter.parse(editor);
            return [parsedSnippets, converter];
        }
        catch (error) {
            throw new Error("Error while parsing snippets" + error);
        }
    });
}
function convertSnippet(converterInstance, snippets, editors) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const convertedSnippets = editors.map((editor) => __awaiter(this, void 0, void 0, function* () {
                return {
                    editor,
                    snippets: yield converterInstance.convert(snippets, editor)
                };
            }));
            return yield Promise.all(convertedSnippets);
        }
        catch (error) {
            throw new Error("Error while converting snippet" + error);
        }
    });
}
function saveSnippet(snippet, output, editor) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let filesContent = [];
            if (isMultipleFile(editor)) {
                filesContent = snippet.split(parser_variables.divider).map((snip) => {
                    const { cleanName, filteredSnippet } = getSnippetName(snip);
                    return ({
                        name: cleanName,
                        snippet: filteredSnippet
                    });
                });
                return yield fileManager_1.default.writeFiles(filesContent.map((file) => ({
                    content: file.snippet,
                    filename: `${file.name}${getFileExtension(editor)}`,
                    filepath: output,
                    overwrite: true,
                })));
            }
            else {
                return [yield fileManager_1.default.writeFile({
                        content: snippet,
                        filename: `snippets${getFileExtension(editor)}`,
                        filepath: output,
                        overwrite: true,
                    })];
            }
        }
        catch (error) {
            throw new Error("Error while saving snippet" + error);
        }
    });
}
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    spinner.start("Loading C-SNIPPET");
    try {
        spinner.stop();
        console.log(...constants_1._CLI.initial_text());
        const { fromEditor, toEditor, snippetsPath, outputPath } = yield getParams();
        yield blank(1);
        spinner.start("Reading snippets...");
        const [snippets, files, snippetsCount] = yield getSnippets(fromEditor, snippetsPath);
        yield sleep(1000);
        spinner.succeed("Snippets read!");
        console.log(...constants_1._CLI.listSnippets(isArray(snippets) ? snippets : [snippets], snippetsCount));
        spinner.start("Parsing snippets...");
        const [parsedSnippets, converter] = yield parseSnippets(snippets, fromEditor);
        yield sleep(1000);
        spinner.succeed("Snippets parsed!");
        spinner.start("Converting snippets...");
        const convertedSnippets = yield convertSnippet(converter, parsedSnippets, isArray(toEditor) ? toEditor : [toEditor]);
        yield sleep(1000);
        spinner.succeed("Snippets converted!");
        console.log(...convertedSnippets.map((editor) => constants_1._CLI.layout.indentedText(`${editor.editor} : ${parsedSnippets.length}`, {
            blank: false,
            dim: true
        })));
        const savedSnippets = convertedSnippets.map((data) => saveSnippet(data.snippets, outputPath, data.editor));
        spinner.start("Saving snippets...");
        yield Promise.all(savedSnippets).catch((error) => {
            throw new Error("Error while saving snippet" + error);
        });
        yield sleep(1000);
        spinner.succeed("Snippets saved!");
        console.log(constants_1._CLI.layout.indentedText(`Snippets path: ${outputPath.toString()}`, {
            blank: false,
            dim: true
        }));
        yield blank();
    }
    catch (error) {
        if (spinner.isSpinning)
            spinner.fail("Something went wrong!");
        errorHandler(error, `Something went wrong: Details below...\n${"🔻".repeat(10)}\n`);
    }
});
main();
