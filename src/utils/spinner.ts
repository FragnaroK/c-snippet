import chalk from "chalk";
import ora from "ora";
import { dots } from 'cli-spinners';
import { THEME } from "./constants";
import { ParserType } from "src/types/types";


const maxWordLength = 6;

const loaders = new Map<ParserType, string>([
    ["atom", "ATOM   "],
    ["vscode", "VSCODE "],
    ["sublime", "SUBLIME"],
    ["dreamweaver", "DREAMWV"],
])

function getLoaderFrames(parser: ParserType): string[] {
    const loader = loaders.get(parser);
    if (!loader) return [];
    return loader.split("").map((letter, i, letters) => chalk.bgBlueBright.white(
        letters.slice(0, i).join("") + " ".repeat(maxWordLength - i)
    ))
}


const _vscode = {
    frames: getLoaderFrames("vscode") ?? [],
    interval: 80
}

const _sublime = {
    frames: getLoaderFrames("sublime")?? [],
    interval: 80
}

const _atom = {
    frames: getLoaderFrames("atom") ?? [],
    interval: 80
}

const _dreamweaver = {
    frames: getLoaderFrames("dreamweaver") ?? [],
    interval: 80
}

export const spinner = ora({
    color: THEME.accent.text,
    spinner: {
        // frames: [
        //     ..._vscode.frames,
        //     ..._sublime.frames,
        //     ..._atom.frames,
        //     ..._dreamweaver.frames,
        // ],
        frames: dots.frames,
        interval: 100
    },
    hideCursor: true,
    text: 'Loading...',
});