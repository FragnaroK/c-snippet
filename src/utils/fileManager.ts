import { promises as fs } from 'fs';
import { WriteOptions } from 'src/types/types';

/**
 * Checks if a file exists.
 * @param {string} dir - The path.
 * @returns {Promise<boolean>} A promise that resolves to true if the path exists, false otherwise.
 * @throws {Error} If the file path is not a string.
 */
export async function isDir(dir: string): Promise<boolean> {
    try {
        const isDirectory = (await fs.stat(dir)).isDirectory();
        const isFile = (await fs.stat(dir)).isFile();
        
        return Promise.all([isDirectory, isFile]).then((values) => values.some((value) => value === true));
    } catch (error) {
        return false;
    }
}

/**
 * Retrieves a list of file names from a directory.
 * @param {string} dir - The directory path.
 * @returns {Promise<string[]>} A promise that resolves to an array of file names.
 */
export async function getFiles(dir: string): Promise<string[]> {
    try {
        const files = await fs.readdir(dir);
        return files;
    } catch (error) {
        return [];
    }
}

/**
 * Reads the content of a file.
 * @param {string} filepath - The path to the file.
 * @returns {Promise<string>} A promise that resolves to the content of the file.
 */
export async function readFile(filepath: string): Promise<string> {
    try {
        const content = await fs.readFile(filepath, 'utf-8');
        return content;
    } catch (error) {
        return '';
    }
}

/**
 * Reads the contents of multiple files.
 * @param {string[]} filepaths - An array of file paths.
 * @returns {Promise<{ filepath: string, content: string }[]>} A promise that resolves to an array of objects containing file paths and their content.
 */
export async function readFiles(filepaths: string[]): Promise<{ filepath: string; content: string; }[]> {
    try {
        const files = await Promise.all(filepaths.map(async (filepath) => {
            const content = await readFile(filepath);
            return {
                filepath,
                content,
            };
        }));

        return files;
    } catch (error) {
        return [];
    }
}

/**
 * Writes content to a file.
 * @param {WriteOptions} options - The write options including filepath, content, and filename.
 * @returns {Promise<[filepath: string, content: string]>} A promise that resolves to an array containing the filepath and a snippet of the content.
 */
export async function writeFile(options: WriteOptions): Promise<[filepath: string, content: string]> {
    const { filepath, content, filename } = options;
    const outdir = filepath.includes(filename) ? filepath.split(filename)[0] : filepath;
    const fname = filepath.includes(filename) ? filepath.split(filename)[1] : filename;

    console.log()

    try {
        await fs.access(outdir);
    } catch (err) {
        await fs.mkdir(outdir);
    }

    await fs.writeFile(`${outdir}/${fname}`, content).catch((err) => {
        throw new Error(err);
    });

    return [filepath ?? `./${fname}`, `${content.slice(0, 20)}...`];
}

/**
 * Writes content to multiple files.
 * @param {WriteOptions[]} options - An array of write options.
 * @returns {Promise<[filepath: string, content: string][]>} A promise that resolves to an array of filepaths and snippets of content.
 */
export async function writeFiles(options: WriteOptions[]): Promise<[filepath: string, content: string][]> {
    try {
        const results = await Promise.all(options.map(async (option) => {
            const result = await writeFile(option);
            return result;
        }));
    
        return results;
    } catch (error) {
        return [];
    }
}

export default {
    getFiles,
    readFile,
    readFiles,
    writeFile,
    writeFiles,
    isDir
};
