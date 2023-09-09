import { CliArgs, ParserType } from '../types/types';
import Utils from '../utils/utils';
import { input, select, checkbox } from '@inquirer/prompts';
import { _CLI } from '../utils/constants';
import { convertSnippet, getSnippets, parseSnippets, saveSnippet } from './paramsHandler';

const {
    isDir,
    sleep,
    isMultipleFile,
    isArray,
    spinner,
    blank,
} = Utils;

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
        snippets: async (editor: ParserType) => ({
            name: 'snippets',
            message: `${isMultipleFile(editor) ? 'Directory' : 'File'} of the snippets to be converted`,
            type: 'input',
            validate: async (input: string) => await isDir(input) ? true : 'Invalid directory or file'
        }),
        output: async (editors: ParserType[]) => ({
            name: 'output',
            message: `${editors.every(async (editor) => isMultipleFile(editor)) ? 'Directory' : 'File'} where the converted snippets will be saved`,
            type: 'input',
            validate: async (input: string) => await isDir(input) ? true : 'Invalid directory or file'
        })
    }
};

/**
 * Retrieves conversion parameters using prompts.
 * @returns Conversion parameters.
 */
async function getParams(): Promise<CliArgs> {
    const { from_editor, to_editor } = questions.selection;
    const fromEditor: ParserType = await select(from_editor) as ParserType;
    const toEditor: ParserType | ParserType[] = await checkbox(to_editor) as ParserType | ParserType[];

    const { snippets, output } = questions.input;
    const snippetsPath = await input(await snippets(fromEditor));
    const outputPath = await input(await output(isArray(toEditor) ? toEditor : [toEditor]));

    return { fromEditor, toEditor, snippetsPath, outputPath };
}


/**
 * Entry point of the CLI application.
 */
const main = async (params?: CliArgs) => {
    try { 
        // ! Path with snippets (TEST) -> ./src/__tests__/snippets/snippets.code-snippets
        // TODO : Implement yargs to enable one line command (cli.ts) and move this code to a separate file (cliGUI.ts)

        console.log(..._CLI.initial_text());

        const { fromEditor, toEditor, snippetsPath, outputPath } = params?? await getParams();
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

        spinner.start("Saving snippets...");
        const savedSnippets = convertedSnippets.map(async (data) => await saveSnippet(data.snippets, outputPath, data.editor))
        await Promise.all(savedSnippets).catch((error) => {
            throw new Error("Error while saving snippets" + error);
        });
        await sleep(1000);
        spinner.succeed("Snippets saved!");

        console.log(_CLI.layout.indentedText(`Snippets path: ${outputPath.toString()}`, {
            blank: false,
            dim: true
        }))

        await blank();

    } catch (error: any) {
        if (spinner.isSpinning) spinner.fail('Something went wrong!');
        throw new Error(error);
        // ! errorHandler not needed because of the throw (Catched in cli.ts)
    }
}

export default main;
