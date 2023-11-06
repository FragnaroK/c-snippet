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
const utils_1 = __importDefault(require("../utils/utils"));
const prompts_1 = require("@inquirer/prompts");
const constants_1 = require("../utils/constants");
const paramsHandler_1 = require("./paramsHandler");
const node_logger_cli_1 = __importDefault(require("node-logger-cli"));
const log = new node_logger_cli_1.default("CLI-GUI", process.env.NODE_ENV === "development");
const { isDir, sleep, isMultipleFile, isArray, spinner, blank, } = utils_1.default;
const questions = {
    selection: {
        from_editor: {
            name: 'fromEditor',
            message: 'Which editor are you converting from?',
            choices: [
                { name: 'Dreamweaver', value: 'dreamweaver', description: '' },
                { name: 'Sublime', value: 'sublime', description: '' },
                { name: 'VS Code', value: 'vscode', description: '' },
                { name: 'Atom', value: 'atom', description: '' }
            ]
        },
        to_editor: {
            name: 'toEditor',
            message: 'Which editor are you converting to?',
            choices: [
                { name: 'Dreamweaver', value: 'dreamweaver', description: '' },
                { name: 'Sublime', value: 'sublime', description: '' },
                { name: 'VS Code', value: 'vscode', description: '' },
                { name: 'Atom', value: 'atom', description: 'WARN: Snippets scope are going to be converted to global' }
            ]
        }
    },
    input: {
        snippets: (editor) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                name: 'snippets',
                message: `${isMultipleFile(editor) ? 'Directory' : 'File'} of the snippets to be converted`,
                type: 'input',
                validate: (input) => __awaiter(void 0, void 0, void 0, function* () { return (yield isDir(input)) ? true : 'Invalid directory or file'; })
            });
        }),
        output: (editors) => __awaiter(void 0, void 0, void 0, function* () {
            return ({
                name: 'output',
                message: `${editors.every((editor) => __awaiter(void 0, void 0, void 0, function* () { return isMultipleFile(editor); })) ? 'Directory' : 'File'} where the converted snippets will be saved`,
                type: 'input',
                validate: (input) => __awaiter(void 0, void 0, void 0, function* () { return (yield isDir(input)) ? true : 'Invalid directory or file'; })
            });
        })
    }
};
/**
 * Retrieves conversion parameters using prompts.
 * @returns Conversion parameters.
 */
function getParams() {
    return __awaiter(this, void 0, void 0, function* () {
        const { from_editor, to_editor } = questions.selection;
        const fromEditor = yield (0, prompts_1.select)(from_editor);
        const toEditor = yield (0, prompts_1.checkbox)(to_editor);
        const { snippets, output } = questions.input;
        const snippetsPath = yield (0, prompts_1.input)(yield snippets(fromEditor));
        const outputPath = yield (0, prompts_1.input)(yield output(isArray(toEditor) ? toEditor : [toEditor]));
        log.d("Params selected", { fromEditor, toEditor, snippetsPath, outputPath });
        return { fromEditor, toEditor, snippetsPath, outputPath };
    });
}
/**
 * Entry point of the CLI application.
 */
const main = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ! Path with snippets (TEST) -> ./src/__tests__/snippets/snippets.code-snippets
        // TODO : Implement yargs to enable one line command (cli.ts) and move this code to a separate file (cliGUI.ts)
        console.log(...constants_1._CLI.initial_text());
        const { fromEditor, toEditor, snippetsPath, outputPath } = params !== null && params !== void 0 ? params : yield getParams();
        yield blank(1);
        spinner.start("Reading snippets...");
        const [snippets, , snippetsCount] = yield (0, paramsHandler_1.getSnippets)(fromEditor, snippetsPath);
        yield sleep(1000);
        spinner.succeed("Snippets read!");
        console.log(...constants_1._CLI.listSnippets(isArray(snippets) ? snippets : [snippets], snippetsCount));
        spinner.start("Parsing snippets...");
        const [parsedSnippets, converter] = yield (0, paramsHandler_1.parseSnippets)(snippets, fromEditor);
        yield sleep(1000);
        spinner.succeed("Snippets parsed!");
        spinner.start("Converting snippets...");
        const convertedSnippets = yield (0, paramsHandler_1.convertSnippet)(converter, parsedSnippets, isArray(toEditor) ? toEditor : [toEditor]);
        yield sleep(1000);
        spinner.succeed("Snippets converted!");
        console.log(...convertedSnippets.map((editor) => constants_1._CLI.layout.indentedText(`${editor.editor} : ${parsedSnippets.length}`, {
            blank: false,
            dim: true
        })));
        spinner.start("Saving snippets...");
        const savedSnippets = convertedSnippets.map((data) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, paramsHandler_1.saveSnippet)(data.snippets, outputPath, data.editor); }));
        yield Promise.all(savedSnippets).catch((error) => {
            throw new Error("Error while saving snippets" + error);
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
            spinner.fail('Something went wrong!');
        throw new Error(error);
    }
});
exports.default = main;
