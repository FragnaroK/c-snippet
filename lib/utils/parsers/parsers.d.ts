import ATOM from './atom';
import DREAMWEAVER from './dreamweaver';
import VSCODE from './vscode';
import SUBLIME from './sublime';
declare const Parsers: {
    ATOM: typeof ATOM;
    DREAMWEAVER: typeof DREAMWEAVER;
    VSCODE: typeof VSCODE;
    SUBLIME: typeof SUBLIME;
};
export default Parsers;
