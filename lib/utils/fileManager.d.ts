import { WriteOptions } from 'src/types/types';
/**
 * Checks if a file exists.
 * @param {string} dir - The path.
 * @returns {Promise<boolean>} A promise that resolves to true if the path exists, false otherwise.
 * @throws {Error} If the file path is not a string.
 */
export declare function isDir(dir: string): Promise<boolean>;
/**
 * Retrieves a list of file names from a directory.
 * @param {string} dir - The directory path.
 * @returns {Promise<string[]>} A promise that resolves to an array of file names.
 */
export declare function getFiles(dir: string): Promise<string[]>;
/**
 * Reads the content of a file.
 * @param {string} filepath - The path to the file.
 * @returns {Promise<string>} A promise that resolves to the content of the file.
 */
export declare function readFile(filepath: string): Promise<string>;
/**
 * Reads the contents of multiple files.
 * @param {string[]} filepaths - An array of file paths.
 * @returns {Promise<{ filepath: string, content: string }[]>} A promise that resolves to an array of objects containing file paths and their content.
 */
export declare function readFiles(filepaths: string[]): Promise<{
    filepath: string;
    content: string;
}[]>;
/**
 * Writes content to a file.
 * @param {WriteOptions} options - The write options including filepath, content, and filename.
 * @returns {Promise<[filepath: string, content: string]>} A promise that resolves to an array containing the filepath and a snippet of the content.
 */
export declare function writeFile(options: WriteOptions): Promise<[filepath: string, content: string]>;
/**
 * Writes content to multiple files.
 * @param {WriteOptions[]} options - An array of write options.
 * @returns {Promise<[filepath: string, content: string][]>} A promise that resolves to an array of filepaths and snippets of content.
 */
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
