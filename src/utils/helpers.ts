import { Parser } from 'htmlparser2';

const parser_variables = {
    divider: '#{DIVIDER}',
    tabstop: '#{TABSTOP}',
    placeholder: '#{PLACEHOLDER}',
    escape: '#{ESCAPE}',
    comment: '#{COMMENT}',
    variable: '#{VARIABLE}',
    null: '#{NULL}',
    undefined: '#{UNDEFINED}',
    snippetName: {
        start: '#{NAME:',
        end: '}'
    },
}

/**
 *  Adds keys from an array of objects to a target object.
 * @param data - An array of objects.
 * @param target - The target object.
 * @returns The target object with the keys added.
 * @example
 * const data = [
 *    { name: 'John', age: 21 },
 *   { name: 'Jane', age: 22 },
 * ];
 * const target = { name: '', age: '' };
 * const result = addKeysToObject(data, target);
 * console.log(result);
 * // { name: { John: '', Jane: '' }, age: { 21: '', 22: '' } }
 * 
 */
function addKeysToObject(data: Array<any>, target: any): any {
    data.forEach((item) => {
        for (const key in item) {
            if (key in target) {
                target[key] = { ...target[key], ...item[key] };
            } else {
                target[key] = { ...item[key] };
            }
        }
    });

    return target;
}

/**
 * Trims an array of strings.
 * @param array - An array of strings.
 * @returns An array of trimmed strings.
 * @example
 * const array = ['  Hello  ', '  World  '];
 * const result = trimArray(array);
 * console.log(result);
 * // ['Hello', 'World']
 * 
 */
function trimArray(array: Array<string>, deep: boolean = false): Array<string> {
    if (!deep) return array.map((line) => line.trim()).filter((item) => item !== '');
    return array.map((line) => line.trim()).filter((item) => item !== '').map((line) => {
        return line.split('').filter((char) => char !== '\t').join('');
    });
}

/**
 * Prettifies an HTML string.
 * @param html - An HTML string.
 * @returns A prettified HTML string.
 * @example
 * const html = '<p>Hello</p><p>World</p>';
 * const result = prettifyHTML(html);
 * console.log(result);
 * // <p>
 * //     Hello
 * // </p>
 * // <p>
 * //     World
 * // </p>
 * 
 */
function prettifyHTML(html: string): string {
    let output = '';
    let indentLevel = 1;

    const parser = new Parser({
        onopentag(name, attribs) {
            indentLevel++;

            output += `${'\t'.repeat(indentLevel)}<${name}`;
            for (const key in attribs) {
                output += ` ${key}="${attribs[key]}"`;
            }

            if (name === 'br') {
                output += '\n';
            } else if (name === 'pre') {
                indentLevel = 0;
            } else if (name === 'code') {
                indentLevel = 0;
            } else if (name === 'p') {
                output += '>';
            } else {
                output += '>\n';
            }

        },
        ontext(text) {
            indentLevel++;
            output += text.trim();
        },
        onclosetag(tagname) {
            indentLevel--;

            if (tagname === 'pre' || tagname === 'code') {
                indentLevel = 1;
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;


            } else if (tagname === 'p') {
                output += `</${tagname}>\n`;
            } else {
                output += `\n${'\t'.repeat(indentLevel)}</${tagname}>\n`;
            }

        },
    }, { decodeEntities: true });

    parser.write(html);
    parser.end();

    return output; // Remove any trailing whitespace
}


export {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parser_variables
};

export default {
    addKeysToObject,
    trimArray,
    prettifyHTML,
    parser_variables
};