import { ParsedSnippet, ParserType } from './types/types';
import Utils from './utils/utils';
import { input, select, checkbox } from '@inquirer/prompts';
import Converter from './converter';
import { _CLI } from './utils/constants';
import fm from './utils/fileManager';
import CSON from 'cson-parser';

const { isDir, sleep, isMultipleFile, errorHandler, isArray, spinner, parser_variables, blank, getSnippetName, getFileExtension } = Utils;

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
        snippets: async (editor: ParserType) => ({
            name: 'snippets',
            message: `${isMultipleFile(editor) ? 'Directory' : 'File'} of the snippets to be converted'`,
            type: 'input',
            validate: async (input: string) => {
                return await isDir(input) ? true : 'Invalid directory or file';
            }
        }),
        output: async (editors: ParserType[]) => ({
            name: 'output',
            message: `${editors.every(async (editor) => isMultipleFile(editor)) ? 'Directory' : 'File'} where the converted snippets will be saved`,
            type: 'input',
            validate: async (input: string) => {
                return await isDir(input) ? true : 'Invalid directory or file';
            }
        })
    }
};

async function getParams() {
    const { from_editor, to_editor } = questions.selection;
    const fromEditor: ParserType = await select(from_editor) as ParserType,
        toEditor: ParserType | ParserType[] = await checkbox(to_editor) as ParserType | ParserType[];

    const { snippets, output } = questions.input;
    const snippetsPath = await input(await snippets(fromEditor)),
        outputPath = await input(await output(isArray(toEditor) ? toEditor : [toEditor]));

    return { fromEditor, toEditor, snippetsPath, outputPath };
}

async function getSnippets(editor: ParserType, path: string): Promise<[string[], string[], number] | [string, string, number]> {
    try {
        if (await isDir(path)) {
            if (isMultipleFile(editor)) {
                const files = await fm.getFiles(path);
                const snippets = files.map(async (file) => {
                    return await fm.readFile(file);
                });

                return await Promise.all([await Promise.all(snippets), files, files.length]);
            } else {
                const snippets = await fm.readFile(path);
                const files = snippets.startsWith("{") ? Object.keys(JSON.parse(snippets)) : Object.keys(CSON.parse(snippets));
                return [[snippets], files, files.length];
            }
        }
        throw new Error("Invalid directory or file");
    } catch (error) {
        throw new Error("Error while reading snippets" + error);
    }
}

async function parseSnippets(snippets: string | string[], editor: ParserType): Promise<[ParsedSnippet[], Converter]> {
    try {
        const converter = new Converter(isArray(snippets) ? snippets.join(parser_variables.divider) : snippets);
        let parsedSnippets: ParsedSnippet[] = await converter.parse(editor);
        return [parsedSnippets, converter];

    } catch (error) {
        throw new Error("Error while parsing snippets" + error);
    }
}

async function convertSnippet(converterInstance: Converter, snippets: ParsedSnippet[], editors: ParserType[]): Promise<{
    editor: ParserType,
    snippets: string
}[]> {
    try {
        const convertedSnippets = editors.map(async (editor) => {
            return {
                editor,
                snippets: await converterInstance.convert(snippets, editor)
            };
        });

        return await Promise.all(convertedSnippets);
       
    } catch (error) {
        throw new Error("Error while converting snippet" + error);
    }
}

async function saveSnippet(snippet: string, output: string, editor: ParserType) {
    try {
        let filesContent = [];
        if (isMultipleFile(editor)) {
            filesContent = snippet.split(parser_variables.divider).map((snip) => {
                const { cleanName, filteredSnippet } = getSnippetName(snip);
                return ({
                name: cleanName,
                snippet: filteredSnippet 
                })
            });
            return await fm.writeFiles(filesContent.map((file) => ({
                content: file.snippet,
                filename: `${file.name}${getFileExtension(editor)}`,
                filepath: output,
                overwrite: true,
            })))
        } else {

            return [await fm.writeFile({
                content: snippet,
                filename: `snippets${getFileExtension(editor)}`,
                filepath: output,
                overwrite: true,
            }) ] 
        }
    } catch (error) {
        throw new Error("Error while saving snippet" + error);
    }
}

const main = async () => {
    spinner.start("Loading C-SNIPPET");
    try { 
        // ? ./src/__tests__/snippets/snippets.code-snippets
        // TODO : Implement the CLI interface without using inquirer (yargs?) 

        spinner.stop();
        console.log(..._CLI.initial_text());

        const { fromEditor, toEditor, snippetsPath, outputPath } = await getParams();
        await blank(1);

        spinner.start("Reading snippets...");
        const [snippets, files, snippetsCount] = await getSnippets(fromEditor, snippetsPath);
        await sleep(1000);
        spinner.succeed("Snippets read!");

        console.log(..._CLI.listSnippets(isArray(snippets) ? snippets : [snippets], snippetsCount));

        spinner.start("Parsing snippets...");
        const [parsedSnippets, converter] = await parseSnippets(snippets, fromEditor);
        await sleep(1000);
        spinner.succeed("Snippets parsed!");

        spinner.start("Converting snippets...");
        const convertedSnippets = await convertSnippet(converter, parsedSnippets, isArray(toEditor) ? toEditor : [toEditor]);
        await sleep(1000);
        spinner.succeed("Snippets converted!");

        console.log(...convertedSnippets.map((editor) => _CLI.layout.indentedText(`${editor.editor} : ${parsedSnippets.length}`, {
            blank: false,
            dim: true
        })));

        const savedSnippets = convertedSnippets.map((data) => saveSnippet(data.snippets, outputPath, data.editor))
        spinner.start("Saving snippets...");
        await Promise.all(savedSnippets).catch((error) => {
            throw new Error("Error while saving snippet" + error);
        });
        await sleep(1000);
        spinner.succeed("Snippets saved!");

        console.log(_CLI.layout.indentedText(`Snippets path: ${outputPath.toString()}`, {
            blank: false,
            dim: true
        }))

        await blank();

    } catch (error) {
        if (spinner.isSpinning) spinner.fail("Something went wrong!");
        errorHandler(error as Error, `Something went wrong: Details below...\n${"🔻".repeat(10)}\n`);
    }
}

main();
