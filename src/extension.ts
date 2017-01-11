'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import CompletionItemProvider from './completionItemProvider';
import LuaCompletionItemSource from './completionItemSource/luaDocCompletionItemSource';
import ScarCompletionItemSource from './completionItemSource/scarDocCompletionItemSource';
import CompletionItemMerger from './completionItemSource/completionItemSourceMerger';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) 
{

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "scar" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);

    let completionItemMerger = new CompletionItemMerger();

    let luaCompletionItemSource = new LuaCompletionItemSource(path.join(__dirname, '../../data/luadoc.json'));
    let scarCompletionItemSource = new ScarCompletionItemSource(path.join(__dirname, '../../data/scardoc.json'));

    let completionItemSources = [
        completionItemMerger.addStaticSource(luaCompletionItemSource),
        completionItemMerger.addStaticSource(scarCompletionItemSource)
    ];

    Promise.all(completionItemSources).then((values: any[]) =>
    {
        let items = completionItemMerger.getCompletionItems();
    });
}

// this method is called when your extension is deactivated
export function deactivate() 
{
    
}