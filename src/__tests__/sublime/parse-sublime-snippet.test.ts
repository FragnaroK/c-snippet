import Utils from "../../utils/utils";
import { ParsedSnippet } from "../../types/types";

const {
    SUBLIME
} = Utils;

const RawSnippets = [
    `
    <snippet>
        <content><![CDATA[  
                <div class="random-div">
                    <p>This is a random div element.</p>
                </div>
            ]]></content>
        <tabTrigger>div</tabTrigger>
        <description>Creates a random div element</description>
        <scope></scope>
    </snippet>
    `,
    `
    <snippet>
        <content><![CDATA[   
                <script>
                    alert("This is a random alert!");
                </script>
            ]]></content>
        <tabTrigger>alert</tabTrigger>
        <description>Creates a random alert</description>
        <scope></scope>
    </snippet>
    `,
    `
    <snippet>
        <content><![CDATA[   
                <button class="random-button">
                    Click Me
                </button>
            ]]></content>
        <tabTrigger>button</tabTrigger>
        <description>Creates a random button element</description>  
        <scope></scope>
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
    const trimmedArray: string[] = array.map((item) => (item.trim()).replace(/\t/g, '')).filter((item) => item !== '');
    return trimmedArray;
}

describe('Sublime Snippet Parser', () => {
    describe('SUBLIME.parse', () => {
        it('should parse a Sublime string into a ParsedSnippet object', async () => {
            const parsedSnippet = await SUBLIME.parse(RawSnippets[0], 'Random Div');
            expect(parsedSnippet).toEqual(Snippet[0]);
        });
    
        it('should parse multiple Sublime strings into a ParsedSnippet array', async () => {
            const parsedSnippets: ParsedSnippet[] = [];
    
            for (let i = 0; i < RawSnippets.length; i++) {
                const parsedSnippet = await SUBLIME.parse(RawSnippets[i], `${Snippet[i].name}`);
                parsedSnippets.push(parsedSnippet);
            }
    
            expect(parsedSnippets[0]).toEqual(Snippet[0]);
            expect(parsedSnippets[1]).toEqual(Snippet[1]);
            expect(parsedSnippets[2]).toEqual(Snippet[2]);
        });
    
    });
    
    describe('SUBLIME.stringify', () => {
        it('should stringify a ParsedSnippet object into a Sublime string', async () => {
            const sublimeString = await SUBLIME.stringify(Snippet[0]);
            expect(trimArray(sublimeString.split('\n'))).toEqual(trimArray(RawSnippets[0].split('\n')));
        });
    
        it('should stringify a ParsedSnippet array into a Sublime string',  async () => {
            let snippets: string[] = [];   
                 
            for (const snip of Snippet) {
                let snippet = await SUBLIME.stringify(snip);
                snippets.push(snippet);
            }
    
            const sublimeString = snippets.map((snippet) => {
                return trimArray(snippet.split('\n'));
            });
    
            expect(sublimeString[0]).toEqual(trimArray(RawSnippets[0].split('\n')));
            expect(sublimeString[1]).toEqual(trimArray(RawSnippets[1].split('\n')));
            expect(sublimeString[2]).toEqual(trimArray(RawSnippets[2].split('\n')));
        });
    
    
    });
});

// describe('DREAMWEAVER.parseFile', () => {
//     it('should parse a CSN file into a ParsedSnippet array', async () => {
//         const parsedSnippets: ParsedSnippet[] = await DREAMWEAVER.parseFile('./src/__tests__/dreamweaver/snippets.csn');
//         expect(parsedSnippets).toEqual(Snippet);
//
//     });
// });