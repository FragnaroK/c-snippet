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
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFiles = exports.writeFile = exports.readFiles = exports.readFile = exports.getFiles = exports.isDir = void 0;
const fs_1 = require("fs");
/**
 * Checks if a file exists.
 * @param {string} dir - The path.
 * @returns {Promise<boolean>} A promise that resolves to true if the path exists, false otherwise.
 * @throws {Error} If the file path is not a string.
 */
function isDir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isDirectory = (yield fs_1.promises.stat(dir)).isDirectory();
            const isFile = (yield fs_1.promises.stat(dir)).isFile();
            return Promise.all([isDirectory, isFile]).then((values) => values.some((value) => value === true));
        }
        catch (error) {
            return false;
        }
    });
}
exports.isDir = isDir;
/**
 * Retrieves a list of file names from a directory.
 * @param {string} dir - The directory path.
 * @returns {Promise<string[]>} A promise that resolves to an array of file names.
 */
function getFiles(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield fs_1.promises.readdir(dir);
            return files;
        }
        catch (error) {
            return [];
        }
    });
}
exports.getFiles = getFiles;
/**
 * Reads the content of a file.
 * @param {string} filepath - The path to the file.
 * @returns {Promise<string>} A promise that resolves to the content of the file.
 */
function readFile(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs_1.promises.readFile(filepath, 'utf-8');
            return content;
        }
        catch (error) {
            return '';
        }
    });
}
exports.readFile = readFile;
/**
 * Reads the contents of multiple files.
 * @param {string[]} filepaths - An array of file paths.
 * @returns {Promise<{ filepath: string, content: string }[]>} A promise that resolves to an array of objects containing file paths and their content.
 */
function readFiles(filepaths) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = yield Promise.all(filepaths.map((filepath) => __awaiter(this, void 0, void 0, function* () {
                const content = yield readFile(filepath);
                return {
                    filepath,
                    content,
                };
            })));
            return files;
        }
        catch (error) {
            return [];
        }
    });
}
exports.readFiles = readFiles;
/**
 * Writes content to a file.
 * @param {WriteOptions} options - The write options including filepath, content, and filename.
 * @returns {Promise<[filepath: string, content: string]>} A promise that resolves to an array containing the filepath and a snippet of the content.
 */
function writeFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { filepath, content, filename } = options;
        const outdir = filepath.includes(filename) ? filepath.split(filename)[0] : filepath;
        const fname = filepath.includes(filename) ? filepath.split(filename)[1] : filename;
        try {
            yield fs_1.promises.access(outdir);
        }
        catch (err) {
            yield fs_1.promises.mkdir(outdir);
        }
        yield fs_1.promises.writeFile(`${outdir}/${fname}`, content).catch((err) => {
            throw new Error(err);
        });
        return [filepath !== null && filepath !== void 0 ? filepath : `./${fname}`, `${content.slice(0, 20)}...`];
    });
}
exports.writeFile = writeFile;
/**
 * Writes content to multiple files.
 * @param {WriteOptions[]} options - An array of write options.
 * @returns {Promise<[filepath: string, content: string][]>} A promise that resolves to an array of filepaths and snippets of content.
 */
function writeFiles(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const results = yield Promise.all(options.map((option) => __awaiter(this, void 0, void 0, function* () {
                const result = yield writeFile(option);
                return result;
            })));
            return results;
        }
        catch (error) {
            return [];
        }
    });
}
exports.writeFiles = writeFiles;
exports.default = {
    getFiles,
    readFile,
    readFiles,
    writeFile,
    writeFiles,
    isDir
};