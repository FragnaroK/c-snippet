import chalk from "chalk";
import { Color } from "ora";
export declare const THEME: {
    main: chalk.Chalk;
    accent: {
        text: Color;
        fg: chalk.Chalk;
        bg: chalk.Chalk;
    };
    dim: chalk.Chalk;
    error: chalk.Chalk;
    success: chalk.Chalk;
    warning: chalk.Chalk;
    info: chalk.Chalk;
    hidden: chalk.Chalk;
};
export declare const _CLI: {
    banner: string;
    layout: {
        line: (blank?: boolean, width?: number) => string;
        indentedText: (text: string, options: {
            blank?: boolean;
            dim?: boolean;
        }) => string;
        centeredWithLine(text: string): string;
    };
    initial_text(): string[];
    help(): void;
    version(): void;
    listSnippets(files: string[], count: number): string[];
};
