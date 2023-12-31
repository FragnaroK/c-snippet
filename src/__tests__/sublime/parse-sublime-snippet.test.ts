import Utils from "../../utils/utils";
import { ParsedSnippet } from "../../types/types";
import { getSnippetName } from "../../utils/helpers";

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
    const spacesRegexp = /^\s*$/;
    const trimmedArray: string[] = array.map((item) => item.trim()).filter((item) => item !== "" && !spacesRegexp.test(item));
    return trimmedArray;
}

describe('Sublime Snippet Parser', () => {
    describe('SUBLIME.parse', () => {
        it('should parse a Sublime string into a ParsedSnippet object', async () => {
            const parsedSnippet = await SUBLIME.parse(RawSnippets[0], 'Random Div').then((snippet) => ({
                ...snippet,
                body: trimArray(snippet.body)
            }));
            expect(parsedSnippet).toEqual(Snippet[0]);
        });
    
        it('should parse multiple Sublime strings into a ParsedSnippet array', async () => {
            const parsedSnippets: ParsedSnippet[] = [];
    
            for (let i = 0; i < RawSnippets.length; i++) {
                const parsedSnippet = await SUBLIME.parse(RawSnippets[i], `${Snippet[i].name}`);
                parsedSnippets.push({
                    ...parsedSnippet,
                    body: trimArray(parsedSnippet.body)
                });
            }
    
            expect(parsedSnippets[0]).toEqual(Snippet[0]);
            expect(parsedSnippets[1]).toEqual(Snippet[1]);
            expect(parsedSnippets[2]).toEqual(Snippet[2]);
        });
    
    });
    
    describe('SUBLIME.stringify', () => {
        it('should stringify a ParsedSnippet object into a Sublime string', async () => {
            const sublimeString = getSnippetName(await SUBLIME.stringify(Snippet[0])).filteredSnippet;
            expect(trimArray(sublimeString.split('\n'))).toEqual(trimArray(RawSnippets[0].split('\n')));
        });
    
        it('should stringify a ParsedSnippet array into a Sublime string',  async () => {
            let snippets: string[] = [];   
                 
            for (const snip of Snippet) {
                let snippet = await SUBLIME.stringify(snip);
                snippets.push(snippet);
            }
    
            const sublimeString = snippets.map((snippet) => {
                const f = getSnippetName(snippet)
                return trimArray(f.filteredSnippet.split('\n'));
            });
    
            expect(trimArray(sublimeString[0])).toEqual(trimArray(RawSnippets[0].split('\n')));
            expect(trimArray(sublimeString[1])).toEqual(trimArray(RawSnippets[1].split('\n')));
            expect(trimArray(sublimeString[2])).toEqual(trimArray(RawSnippets[2].split('\n')));
        });
    
    
    });
});

