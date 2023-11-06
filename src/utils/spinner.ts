import ora from "ora";
import { dots } from 'cli-spinners';
import { THEME } from "./constants";

export const spinner = ora({
    color: THEME.accent.text,
    spinner: {
        frames: dots.frames,
        interval: 100
    },
    hideCursor: true,
    text: 'Loading...',
});