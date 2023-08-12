import { ParserType } from './types/types';
import Utils from './utils/utils';
import { input, select, checkbox } from '@inquirer/prompts';
import Converter from './converter';
import { THEME, _CLI, spinner } from './utils/constants';
import fm from './utils/fileManager';
import { blank } from './utils/helpers';

const { isDir, sleep, isMultipleFile, errorHandler, isArray } = Utils;

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
            message: `${await isMultipleFile(editor) ? 'Directory' : 'File'} of the snippets to be converted'`,
            type: 'input',
            validate: async (input: string) => {
                return await isDir(input) ? true : 'Invalid directory or file';
            }
        }),
        output: async (editors: ParserType[]) => ({
            name: 'output',
            message: `${editors.every(async (editor) => await isMultipleFile(editor)) ? 'Directory' : 'File'} where the converted snippets will be saved`,
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

async function getSnippets(editor: ParserType, path: string): Promise<[string[], string[]] | [string, string]> {
    try {
        if (await isDir(path)) {
            if (await isMultipleFile(editor)) {
                const files = await fm.getFiles(path);
                const snippets = files.map(async (file) => {
                    return await fm.readFile(file);
                });

                return await Promise.all([await Promise.all(snippets), files]);
            } else {
                return [await fm.readFile(path), path];
            }
        }
        throw new Error("Invalid directory or file");
    } catch (error) {
        throw new Error("Error while reading snippets" + error);
    }
}

const main = async () => {
    try { 

        // ./src/__tests__/snippets/snippets.code-snippets
        // TODO : Implement the CLI interface without using inquirer (yargs?) 
        console.log(..._CLI.initial_text());

        const { fromEditor, toEditor, snippetsPath, outputPath } = await getParams();

        await blank(2);

        spinner.start("Reading snippets...");
        const [snippets, files] = await getSnippets(fromEditor, snippetsPath);
        
        await sleep(1000);
        

        spinner.succeed("Snippets read!");

        console.log(..._CLI.listSnippets(isArray(snippets) ? snippets : [snippets], isArray(files) ? files : [files]));



        spinner.start("Parsing snippets...");
        await sleep(2000);
        spinner.succeed("Snippets parsed!");

        spinner.start("Converting snippets...");
        await sleep(2000);
        spinner.succeed("Snippets converted!");

        spinner.start("Saving snippets...");
        await sleep(2000);
        spinner.succeed("Snippets saved!");

        console.log(`\n\n${THEME.success("Done!")}`);

        console.log('\n');

        console.log(fromEditor, toEditor, snippetsPath, outputPath);

    } catch (error) {
        if (spinner.isSpinning) spinner.fail("Something went wrong!");
        errorHandler(error as Error, `Something went wrong: Details below...\n${"🔻".repeat(10)}\n`);
    }
}

main();
