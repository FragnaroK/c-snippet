#!/usr/bin/env node
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
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const utils_1 = __importDefault(require("../utils/utils"));
const cliGUI_1 = __importDefault(require("./cliGUI"));
const constants_1 = require("../utils/constants");
const chalk_1 = __importDefault(require("chalk"));
const node_logger_cli_1 = __importDefault(require("node-logger-cli"));
const log = new node_logger_cli_1.default("CLI", process.env.NODE_ENV === "development");
// TODO : Improve character escaping
// TODO : Add more tests
// TODO : Download and test snippets in different editors
const { sleep, errorHandler, spinner, blank, } = utils_1.default;
/**
 * Retrieves conversion parameters using prompts.
 * @returns Conversion parameters.
 */
function getParams() {
    return __awaiter(this, void 0, void 0, function* () {
        const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
            .options({
            fromEditor: {
                alias: 'f',
                type: 'string',
                description: 'Editor to convert from',
                choices: constants_1.available_editors,
            },
            toEditor: {
                alias: 't',
                type: 'array',
                description: 'Editor to convert to',
                choices: constants_1.available_editors,
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
            .argv;
        const { fromEditor, toEditor, snippetsPath, outputPath } = argv;
        return { fromEditor, toEditor, snippetsPath, outputPath };
    });
}
/**
 * Entry point of the CLI application.
 */
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🚀 Welcome to Snippets Converter CLI! 🚀 (One line command)");
        blank();
        const params = yield getParams()
            .then((params) => {
            return params;
        })
            .catch((error) => {
            console.log("Invalid params, starting GUI...\n\n", chalk_1.default.yellowBright(error.message));
            return undefined;
        });
        blank();
        spinner.start("Loading C-SNIPPET");
        yield sleep(3000);
        spinner.stop();
        log.d("Params selected", { params });
        yield (0, cliGUI_1.default)((params === null || params === void 0 ? void 0 : params.fromEditor) && (params === null || params === void 0 ? void 0 : params.toEditor) && (params === null || params === void 0 ? void 0 : params.snippetsPath) && (params === null || params === void 0 ? void 0 : params.outputPath) ? params : undefined);
    }
    catch (error) {
        if (spinner.isSpinning)
            spinner.fail('Something went wrong!');
        errorHandler(error, "😩 Error while converting snippets! 🔎 check the logs for more details.");
    }
});
main();
