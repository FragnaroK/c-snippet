#!/usr/bin/env node
import { CliArgs, ParserType } from 'src/types/types';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Utils from '../utils/utils';
import CLIGUI from './cliGUI';
import { convertSnippet, getSnippets, parseSnippets, saveSnippet } from './paramsHandler';
import { available_editors } from '../utils/constants';
import chalk from 'chalk';

interface YargsArgs extends CliArgs {
    _: (string | number)[];
    $0: string;
}

// TODO : Improve character escaping
// TODO : Add more tests
// TODO : Download and test snippets in different editors

const {
    isDir,
    sleep,
    isMultipleFile,
    errorHandler,
    isArray,
    spinner,
    parserVariables,
    blank,
    getSnippetName,
    getFileExtension
} = Utils;


/**
 * Retrieves conversion parameters using prompts.
 * @returns Conversion parameters.
 */
async function getParams(): Promise<CliArgs> {
    const argv: YargsArgs = yargs(hideBin(process.argv))
        .options({
            fromEditor: {
                alias: 'f',
                type: 'string',
                description: 'Editor to convert from',
                choices: available_editors,
            },
            toEditor: {
                alias: 't',
                type: 'array',
                description: 'Editor to convert to',
                choices: available_editors,
            },
            snippetsPath: {
                alias: 's',
                type: 'string',
                description: 'Path to the snippets to be converted',
            },
            outputPath: {
                alias: 'o',
                type: 'string',
                description: 'Path to the output file or directory'
            }
        })
        .help()
        .argv as unknown as YargsArgs;

        const { fromEditor, toEditor, snippetsPath, outputPath } = argv;

        return { fromEditor, toEditor, snippetsPath, outputPath };
}

/**
 * Entry point of the CLI application.
 */
const main = async () => {
    try {
        console.log("🚀 Welcome to Snippets Converter CLI! 🚀 (One line command)");
        blank();
        // console.log("One line command will be available soon! For now, please use the interactive CLI. 😅");

        const params = await getParams()
        .then((params) => {
            return params;
        })
        .catch((error) => {
            console.log("Invalid params, starting GUI...\n\n", chalk.yellowBright(error.message))
            return undefined;
        });

        blank();
        spinner.start("Loading C-SNIPPET");
        await sleep(3000);
        spinner.stop();

        await CLIGUI(params?.fromEditor && params?.toEditor && params?.snippetsPath && params?.outputPath ? params : undefined);

    } catch (error) {
        if (spinner.isSpinning) spinner.fail('Something went wrong!');
        errorHandler(error as Error, "😩 Error while converting snippets! 🔎 check the logs for more details.");
    }
}

main();
