import Utils from '../../utils/utils';
import { ParsedSnippet } from '../../types/types';

const {
    VSCODE
} = Utils;

const Snippets: ParsedSnippet[] = [
    {
        "name": "Comment divider",
        "prefix": "cmt-divider",
        "body": [
            "$BLOCK_COMMENT_START<||========================= ${1:TITLE} =========================||> $BLOCK_COMMENT_END",
            "$0"
        ],
        "description": "Insert a big comment divider"
    },
    {
        "name": "Comment divider - Small",
        "prefix": "cmt-divider-sm",
        "body": [
            "$BLOCK_COMMENT_START |=|=|=|=> ${1:TITLE} <=|=|=|=| $BLOCK_COMMENT_END",
            "$0"
        ],
        "description": "Insert a small comment divider"
    }
]

const RawSnippets = `{
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
}`;

describe('VSCODE.parse', () => {
    it('should parse a VS Code snippet', () => {
        const parsedSnippet = VSCODE.parse(RawSnippets);
        expect(parsedSnippet).toEqual(Snippets);
    });
});

describe('VSCODE.stringify', () => {
    it('should stringify a VS Code snippet', () => {
        const stringifiedSnippet = VSCODE.stringify(Snippets);
        expect(stringifiedSnippet).toEqual(JSON.stringify(JSON.parse(RawSnippets), null, 2));
    });
});
