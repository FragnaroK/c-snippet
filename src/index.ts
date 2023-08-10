import 'module-alias/register';
import { select } from '@inquirer/prompts';
import { textSync } from 'figlet';

const questions = [
    {
        name: 'fromEditor',
        message: 'Which editor are you converting from?',
        choices: [
            { name: 'Dreamweaver', value: 'dreamweaver', description: "" },
            { name: 'Sublime', value: 'sublime', description: "" },
            { name: 'VS Code', value: 'vscode', description: "" },
            { name: 'Atom', value: 'atom', description: "" }
        ]
    },
    {
        name: 'toEditor',
        message: 'Which editor are you converting to?',
        choices: [
            { name: 'Dreamweaver', value: 'dreamweaver', description: "" },
            { name: 'Sublime', value: 'sublime', description: "" },
            { name: 'VS Code', value: 'vscode', description: "" },
            { name: 'Atom', value: 'atom', description: "WARN: Snippets scope are going to be converted to global" }
        ]
    }
]; 

const main = async () => {
    console.log(textSync('C-Snippet', { horizontalLayout: 'full', font: 'ANSI Shadow' }), '\n');
    const fromEditor = await select(questions[0]);
    const toEditor = await select(questions[1]);
    console.log(fromEditor, toEditor);
}

main();
