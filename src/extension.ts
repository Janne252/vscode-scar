'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
import CompletionItemProvider from './completionItemProvider';
import LuaCompletionItemSource from './completionItemSource/luaDocCompletionItemSource';
import ScarCompletionItemSource from './completionItemSource/scarDocCompletionItemSource';
import LuaConstsAutoCompletionItemSource from './completionItemSource/luaConstsAutoCompletionItemSource';
import CompletionItemMerger from './completionItemSourceMerger/completionItemSourceMerger';

export function activate(context: vscode.ExtensionContext) 
{
    let completionItemMerger = new CompletionItemMerger();

    let luaCompletionItemSource = new LuaCompletionItemSource(path.join(__dirname, '../../data/luadoc.json'));
    let scarCompletionItemSource = new ScarCompletionItemSource(path.join(__dirname, '../../data/scardoc.json'));
    let luaConstsAutoCompletionItemSource = new LuaConstsAutoCompletionItemSource(path.join(__dirname, '../../data/luaconstsauto.scar'));

    let completionItemSources = [
        completionItemMerger.addStaticSource(luaCompletionItemSource),
        completionItemMerger.addStaticSource(scarCompletionItemSource),
        completionItemMerger.addStaticSource(luaConstsAutoCompletionItemSource)
    ];

    Promise.all(completionItemSources).then((values: any[]) =>
    {
        let completionItemProvider = vscode.languages.registerCompletionItemProvider('scar', new CompletionItemProvider(completionItemMerger));
        context.subscriptions.push(completionItemProvider);
    });
}

export function deactivate() 
{
    
}