import Utils from "../../utils/utils";
import { ParsedSnippet } from "../../types/types";

const {
    DREAMWEAVER
} = Utils;

const RawSnippets = [
    `<?xml version="1.0" encoding="utf-8"?>
    <snippet name="Random Div" description="Creates a random div element" preview="div" type="block">
        <insertText location="beforeSelection"> 
            <![CDATA[ 
                <div class="random-div">
                    <p>This is a random div element.</p>
                </div>
            ]]>
        </insertText>
        <insertText location="afterSelection"></insertText>
    </snippet>
    `,
    `<?xml version="1.0" encoding="utf-8"?>
    <snippet name="Random Alert" description="Creates a random alert" preview="alert" type="block">
        <insertText location="beforeSelection"> 
            <![CDATA[ 
                <script>
                    alert("This is a random alert!");
                </script>
            ]]>
        </insertText>
        <insertText location="afterSelection"></insertText>
    </snippet>
    `,
    `<?xml version="1.0" encoding="utf-8"?>
    <snippet name="Random Button" description="Creates a random button element" preview="button" type="block">
        <insertText location="beforeSelection"> 
            <![CDATA[ 
                <button class="random-button">
                    Click Me
                </button>
            ]]>
        </insertText>
        <insertText location="afterSelection"></insertText>
    </snippet>
    `,
];

const Snippet: ParsedSnippet[] = [
    {
        name: 'Random Div',
        description: 'Creates a random div element',
        prefix: 'div',
        body: [
            '<div class="random-div">',
            '<p>This is a random div element.</p>',
            '</div>',
        ],
        scope: ''
    },
    {
        name: 'Random Alert',
        description: 'Creates a random alert',
        prefix: 'alert',
        body: [ 
            '<script>',
            'alert("This is a random alert!");',
            '</script>', 
        ],
        scope: ''
    },
    {
        name: 'Random Button',
        description: 'Creates a random button element',
        prefix: 'button',
        body: [
            '<button class="random-button">',
            'Click Me',
            '</button>',
        ],
        scope: ''
    },
];

function trimArray(array: string[]): string[] {
    const trimmedArray: string[] = array.map((item) => item.trim()).filter((item) => item !== '');
    return trimmedArray;
}

describe('DREAMWEAVER.parse', () => {
    it('should parse a CSN snippet', async () => {
        const parsedSnippet = await DREAMWEAVER.parse(RawSnippets[0]);
        expect(parsedSnippet).toEqual(Snippet[0]);
    });

    it('should parse multiple CSN snippets', async () => {
        const parsedSnippets: ParsedSnippet[] = [];

        for (const rawSnippet of RawSnippets) {
            const parsedSnippet = await DREAMWEAVER.parse(rawSnippet);
            parsedSnippets.push(parsedSnippet);
        } 

        expect(parsedSnippets).toEqual(Snippet);
    });
});

describe('DREAMWEAVER.stringify', () => {
    it('should stringify a ParsedSnippet array into a CSN string', async () => {
        const stringifiedSnippet = await DREAMWEAVER.stringify(Snippet[0]);
        expect(trimArray(stringifiedSnippet.split('\n'))).toEqual(trimArray(RawSnippets[0].split('\n')));
    });

    it('should stringify multiple ParsedSnippet array into a CSN string', async () => {
        const stringifiedSnippets: string[] = [];

        
        for (const snippet of Snippet) {
            const stringifiedSnippet = await DREAMWEAVER.stringify(snippet);
            stringifiedSnippets.push(stringifiedSnippet);
        }

        expect(trimArray(stringifiedSnippets[0].split('\n'))).toEqual(trimArray(RawSnippets[0].split('\n')));
        expect(trimArray(stringifiedSnippets[1].split('\n'))).toEqual(trimArray(RawSnippets[1].split('\n')));
        expect(trimArray(stringifiedSnippets[2].split('\n'))).toEqual(trimArray(RawSnippets[2].split('\n')));
    });
    
});

// describe('DREAMWEAVER.parseFile', () => {
//     it('should parse a CSN file into a ParsedSnippet array', async () => {
//         const parsedSnippets: ParsedSnippet[] = await DREAMWEAVER.parseFile('./src/__tests__/dreamweaver/snippets.csn');
//         expect(parsedSnippets).toEqual(Snippet);
//      
//     });
// });