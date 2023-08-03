import { Parser } from 'htmlparser2';

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

function trimArray(array: Array<string>): Array<string> {
    return array.map((line) => line.trim()).filter((item) => item !== '');
}

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
    prettifyHTML
};