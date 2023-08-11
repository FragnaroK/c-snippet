import { input, select, checkbox } from '@inquirer/prompts';
import Utils from './utils/utils';
import { textSync } from 'figlet';
import chalk from 'chalk';
import ora, { Color } from 'ora';
import {aesthetic} from 'cli-spinners';

const { isDir, sleep } = Utils;

const THEME = {
    main: chalk.whiteBright,
    accent: {
        text: "cyan" as Color,
        fg: chalk.cyan,
        bg: chalk.bgCyanBright
    },
    dim: chalk.dim,
    error: chalk.redBright,
    success: chalk.greenBright,
    warning: chalk.yellowBright,
    info: chalk.blueBright,
    hidden: chalk.bgBlackBright,
}

const cli_initial_text = [
    `\n${THEME.accent.bg.hidden(":".repeat(69))}\n\n`,
    textSync('C-Snippet', { horizontalLayout: 'full', font: 'ANSI Shadow' }),
    `\n${THEME.accent.bg.hidden(":".repeat(10))} ${chalk.underline('Convert your snippets between different editors')} ${THEME.accent.bg.hidden(":".repeat(10))}\n\n`,
    `${THEME.dim(".".repeat(15))}Run ${THEME.main.bold("c-snippet -h")} for more${THEME.dim(".".repeat(15))}${THEME.dim("by @FragnaroK")}\n`, "=".repeat(68),
    "\n\n"
];

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
        snippets: {
            name: 'snippets',
            message: 'Directory or file of the snippets to be converted',
            type: 'input',
            validate: async (input: string) => {
                return await isDir(input)? true : 'Invalid directory or file';
            }
        },
        output: {
            name: 'output',
            message: 'Directory or file where the converted snippets will be saved',
            type: 'input',
            validate: async (input: string) => {
                return await isDir(input)? true : 'Invalid directory or file';
            }
        }
    }
};

const main = async () => {
    // TODO : Implement the CLI interface without using inquirer (yargs?)

    const spinner = ora({
        color: THEME.accent.text,
        spinner: aesthetic,
        hideCursor: true, 
        text: 'Loading...',
    }).start();

    await sleep(2000);
    spinner.stop();
    console.log(...cli_initial_text);
    
    const { from_editor, to_editor } = questions.selection;
    const fromEditor = await select(from_editor),
        toEditor = await checkbox(to_editor);

    const { snippets, output } = questions.input;
    const snippetsPath = await input(snippets),
        outputPath = await input(output);  

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
}

main();
