#!/usr/bin/env node
import { CliArgs } from 'src/types/types';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Utils from '../utils/utils';
import CLIGUI from './cliGUI';
import { available_editors } from '../utils/constants';
import chalk from 'chalk';
import Logger from 'node-logger-cli';

interface YargsArgs extends CliArgs {
    _: (string | number)[];
    $0: string;
}

const log = new Logger("CLI", process.env.NODE_ENV === "development");

// TODO : Improve character escaping
// TODO : Add more tests
// TODO : Download and test snippets in different editors

const {
    errorHandler,
    spinner,
    blank,
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
        blank();
        console.log("🚀 Welcome to Snippets Converter CLI! 🚀 (One line command)");

        const params = await getParams()
        .then((params) => {
            return params;
        })
        .catch((error) => {
            console.log("Invalid params, starting GUI...\n\n", chalk.yellowBright(error.message))
            return undefined;
        });

        blank();
        // spinner.start("Loading C-SNIPPET");
        // await sleep(3000);
        // spinner.stop();

        log.d("Params selected", { params })

        await CLIGUI(params?.fromEditor && params?.toEditor && params?.snippetsPath && params?.outputPath ? params : undefined);

    } catch (error) {
        if (spinner.isSpinning) spinner.fail('Something went wrong!');
        errorHandler(error as Error, "😩 Error while converting snippets! 🔎 check the logs for more details.");
    }
}

main();
