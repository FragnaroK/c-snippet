import Utils from "../../utils/utils";
import { ParsedSnippet } from "../../types/types";


const {
    ATOM
} = Utils;

// Collection of snippets to test
const Snippet: ParsedSnippet[] = [
    {
        name: 'For Loop',
        description: 'No description provided',
        prefix: 'forloop',
        body: [
            'for (let i = 1; i <= ${1:number}; i++) {',
            '  ${2:// Your code here}',
            '}'
        ],
        scope: '.source.js'
    },
    {
        name: 'For Loop 2',
        description: 'No description provided',
        prefix: 'forloop',
        body: [
            'for (let i = 1; i <= ${1:number}; i++) {',
            '  ${2:// Your code here}',
            '}'
        ],
        scope: '.source.js'
    },
    {
        name: 'For Loop 3',
        description: 'No description provided',
        prefix: 'forloop',
        body: [
            'for (let i = 1; i <= ${1:number}; i++) {',
            '  ${2:// Your code here}',
            '}'
        ],
        scope: '.source.js'
    },
];

const RawSnippets = [
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
 
describe('ATOM.parseString', () => {
    it('should parse a CSON string into a ParsedSnippet array', async () => {
        const parsedSnippets: ParsedSnippet[] = ATOM.parseString(RawSnippets[0]);

        expect(parsedSnippets).toHaveLength(1);

        expect(parsedSnippets[0]).toHaveProperty('name');
        expect(parsedSnippets[0]).toHaveProperty('description');
        expect(parsedSnippets[0]).toHaveProperty('prefix');
        expect(parsedSnippets[0]).toHaveProperty('body');
        expect(parsedSnippets[0]).toHaveProperty('scope');

        expect(parsedSnippets[0]).toMatchObject({
            name: expect.any(String),
            description: expect.any(String),
            prefix: expect.any(String),
            body: expect.any(Array),
            scope: expect.any(String)
        });

        expect(parsedSnippets[0]).toEqual(Snippet[0]);
    });
});

describe('ATOM.parseString (multiple sources)', () => {
    it('should parse a CSON string with multiple sources into a ParsedSnippet array', () => {
        const parsedSnippets: ParsedSnippet[] = ATOM.parseString(RawSnippets[1]);

        expect(parsedSnippets).toHaveLength(2);

        expect(parsedSnippets[0]).toHaveProperty('name');
        expect(parsedSnippets[0]).toHaveProperty('description');
        expect(parsedSnippets[0]).toHaveProperty('prefix');
        expect(parsedSnippets[0]).toHaveProperty('body');
        expect(parsedSnippets[0]).toHaveProperty('scope');

        expect(parsedSnippets[0]).toMatchObject({
            name: expect.any(String),
            description: expect.any(String),
            prefix: expect.any(String),
            body: expect.any(Array),
            scope: expect.any(String)
        });

        expect(parsedSnippets[0]).toEqual({
            name: 'For Loop',
            description: 'No description provided',
            prefix: 'forloop',
            body: [
                'for (let i = 1; i <= ${1:number}; i++) {',
                '  ${2:// Your code here}',
                '}'
            ],
            scope: '.source.js'
        });

        expect(parsedSnippets[1]).toHaveProperty('name');
        expect(parsedSnippets[1]).toHaveProperty('description');
        expect(parsedSnippets[1]).toHaveProperty('prefix');
        expect(parsedSnippets[1]).toHaveProperty('body');
        expect(parsedSnippets[1]).toHaveProperty('scope');

        expect(parsedSnippets[1]).toMatchObject({
            name: expect.any(String),
            description: expect.any(String),
            prefix: expect.any(String),
            body: expect.any(Array),
            scope: expect.any(String)
        });

        expect(parsedSnippets[1]).toEqual({
            name: 'For Loop 2',
            description: 'No description provided',
            prefix: 'forloop',
            body: [
                'for (let i = 1; i <= ${1:number}; i++) {',
                '  ${2:// Your code here}',
                '}'
            ],
            scope: '.source.ts'
        });
    });
});

describe('ATOM.stringifySnippet', () => {
    it('should stringify a ParsedSnippet into a CSON string', () => {
        const csonString: string = ATOM.stringifySnippet(Snippet);

        expect(csonString).toEqual(`'*':
  'For Loop':
    'prefix': 'forloop'
    'body': '''
      for (let i = 1; i <= \${1:number}; i++) {
        \${2:// Your code here}
      }
    '''
  'For Loop 2':
    'prefix': 'forloop'
    'body': '''
      for (let i = 1; i <= \${1:number}; i++) {
        \${2:// Your code here}
      }
    '''
  'For Loop 3':
    'prefix': 'forloop'
    'body': '''
      for (let i = 1; i <= \${1:number}; i++) {
        \${2:// Your code here}
      }
    '''`);
    });
});