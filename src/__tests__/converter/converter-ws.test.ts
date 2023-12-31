/**
 * 
 * Test for the converter-ws.ts file
 * "ws" stands for "without source"
 * 
 * */

import Converter from '../../converter';
import { parserVariables } from '../../utils/helpers';

const RawVSCODESnippets = `{
    "Comment divider": {
		"prefix": "cmt-divider",
		"body": [
			"$BLOCK_COMMENT_START<||========================= \${1:TITLE} =========================||> $BLOCK_COMMENT_END",
			"$0"
		],
		"description": "Insert a big comment divider"
	},
	"Comment divider - Small": {
		"prefix": "cmt-divider-sm",
		"body": [
			"$BLOCK_COMMENT_START |=|=|=|=> \${1:TITLE} <=|=|=|=| $BLOCK_COMMENT_END",
			"$0"
		],
		"description": "Insert a small comment divider"
	}
}`

const RawAtomSnippets = [
    `'.source.js':
    'For Loop':
      'prefix': 'forloop'
      'body': """
        for (let i = 1; i <= \${1:number}; i++) {
          \${2:// Your code here}
        }
      """`,
    `
'.source.js':
    'For Loop':
      'prefix': 'forloop'
      'body': """
        for (let i = 1; i <= \${1:number}; i++) {
          \${2:// Your code here}
        }
      """
'.source.ts':
    'For Loop 2':
      'prefix': 'forloop'
      'body': """
        for (let i = 1; i <= \${1:number}; i++) {
          \${2:// Your code here}
        }
      """
`
];

const RawDwSnippets = [
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

const RawSublimeSnippets = [
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

describe('Converter Without Source Specified', () => {
    describe('Converter.findSource', () => {
        it('should find the source of the snippets -> VSCode', async () => {
            const converter = new Converter(RawVSCODESnippets);
            const source = await converter.findSource();
            expect(source).toMatch('vscode');
        });

        it('should find the source of the snippets -> Atom', async () => {
            const converter = new Converter(RawAtomSnippets[0]);
            const source = await converter.findSource();
            expect(source).toMatch('atom');
        });

        it('should find the source of the snippets -> Dreamweaver', async () => {
            const converter = new Converter(RawDwSnippets[0]);
            const source = await converter.findSource();
            expect(source).toMatch('dreamweaver');
        });

        it('should find the source of the snippets -> Sublime', async () => {
            const converter = new Converter(RawSublimeSnippets[0]);
            const source = await converter.findSource();
            expect(source).toMatch('sublime');
        });
    });

    describe('Converter.init', () => {
        it('should initialize the converter without source -> VSCode', async () => {
            const converter = await new Converter(RawVSCODESnippets).init();
            expect(converter.source).toMatch('vscode');
        });

        it('should initialize the converter without source -> Atom', async () => {
            const converter = await new Converter(RawAtomSnippets[0]).init();
            expect(converter.source).toMatch('atom');
        });

        it('should initialize the converter without source -> Dreamweaver', async () => {
            const converter = await new Converter(RawDwSnippets[0]).init();
            expect(converter.source).toMatch('dreamweaver');
        });

        it('should initialize the converter without source -> Sublime', async () => {
            const converter = await new Converter(RawSublimeSnippets[0]).init();
            expect(converter.source).toMatch('sublime');
        });
    });


    describe('Converter.parse', () => {
        it('should parse the snippets -> VSCode', async () => {
            const converter = await new Converter(RawVSCODESnippets).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(2);
        });

        it('should parse the snippets -> Atom', async () => {
            const converter = await new Converter(RawAtomSnippets[0]).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(1);
        });

        it('should parse the snippets -> Dreamweaver', async () => {
            const converter = await new Converter(RawDwSnippets[0]).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(1);
        });

        it('should parse the snippets -> Sublime', async () => {
            const converter = await new Converter(RawSublimeSnippets[0]).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(1);
        });
    });

    describe('Converter.parse (multiple)', () => {
        it('should parse the snippets -> Atom', async () => {
            const converter = await new Converter(RawAtomSnippets.join("\n")).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(2);
        });

        it('should parse the snippets -> Sublime', async () => {
            const converter = await new Converter(RawSublimeSnippets.join(parserVariables.divider)).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(RawSublimeSnippets.length);
        });

        it('should parse the snippets -> Dreamweaver', async () => {
            const converter = await new Converter(RawDwSnippets.join(parserVariables.divider)).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(RawDwSnippets.length);
        });

        it('should parse the snippets -> VSCode', async () => {
            const converter = await new Converter(RawVSCODESnippets).init();
            const parsedSnippets = await converter.parse();
            expect(parsedSnippets).toHaveLength(2);
        });
    });


    describe('Converter.convert', () => {
        it('should convert the snippets -> VSCode to Atom', async () => {
            const converter = await new Converter(RawVSCODESnippets, "atom").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(2);
            expect(convertedSnippets).toContain("*");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[1].prefix);
        });

        it('should convert the snippets -> Atom to Sublime', async () => {
            const converter = await new Converter(RawAtomSnippets[0], "sublime").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(1);
            expect(convertedSnippets).toContain("<snippet>");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[0].description);
        });

        it('should convert the snippets -> Dreamweaver to VSCode', async () => {
            const converter = await new Converter(RawDwSnippets[0], "vscode").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(1);
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[0].description);
        });

        it('should convert the snippets -> Sublime to Dreamweaver', async () => {
            const converter = await new Converter(RawSublimeSnippets[0], "dreamweaver").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(1);
            expect(convertedSnippets).toContain(`<snippet name="${parsedSnippets[0].name}"`);
            expect(convertedSnippets).toContain("afterSelection");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[0].description);
        });
    });

    describe('Converter.convert (multiple)', () => {
        it('should convert the snippets -> Atom to Sublime', async () => {
            const converter = await new Converter(RawAtomSnippets.join("\n"), "sublime").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(2);
            expect(convertedSnippets).toContain("<snippet>");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[1].prefix);
        });

        it('should convert the snippets -> Sublime to Dreamweaver', async () => {
            const converter = await new Converter(RawSublimeSnippets.join(parserVariables.divider), "dreamweaver").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(RawSublimeSnippets.length);
            expect(convertedSnippets).toContain(`<snippet name="${parsedSnippets[0].name}"`);
            expect(convertedSnippets).toContain("afterSelection");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[0].description);
        });

        it('should convert the snippets -> Dreamweaver to VSCode', async () => {
            const converter = await new Converter(RawDwSnippets.join(parserVariables.divider), "vscode").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(RawDwSnippets.length);
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[0].description);
        });

        it('should convert the snippets -> VSCode to Atom', async () => {
            const converter = await new Converter(RawVSCODESnippets, "atom").init();
            const parsedSnippets = await converter.parse();
            const convertedSnippets = await converter.convert(parsedSnippets);

            expect(parsedSnippets).toHaveLength(2);
            expect(convertedSnippets).toContain("*");
            expect(convertedSnippets).toContain(parsedSnippets[0].prefix);
            expect(convertedSnippets).toContain(parsedSnippets[1].prefix);
        });
    });
})