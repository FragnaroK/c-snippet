import { WriteOptions } from 'src/types/types';
export declare function isDir(dir: string): Promise<boolean>;
export declare function getFiles(dir: string): Promise<string[]>;
export declare function readFile(filepath: string): Promise<string>;
export declare function readFiles(filepaths: string[]): Promise<{
    filepath: string;
    content: string;
}[]>;
export declare function writeFile(options: WriteOptions): Promise<[filepath: string, content: string]>;
export declare function writeFiles(options: WriteOptions[]): Promise<[filepath: string, content: string][]>;
declare const _default: {
    getFiles: typeof getFiles;
    readFile: typeof readFile;
    readFiles: typeof readFiles;
    writeFile: typeof writeFile;
    writeFiles: typeof writeFiles;
    isDir: typeof isDir;
};
export default _default;
