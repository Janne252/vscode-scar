'use strict';

import {
    CompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind,
    TextDocument, Position, CancellationToken
} from 'vscode';

import {
    ILuaDoc
} from './scar';

import CompletionItemSourceMerger from './completionItemSourceMerger/completionItemSourceMerger';

import * as fs from 'fs';
import * as path from 'path';

export default class CompletionItemProver implements CompletionItemProvider
{
    public luaDocData: ILuaDoc = undefined;

    protected merger: CompletionItemSourceMerger;
    constructor(merger: CompletionItemSourceMerger)
    {
        this.merger = merger;
    }

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList>
    {
        return new Promise((resolve, reject) => 
        {
            resolve(this.merger.getCompletionItems());
        });
    }
}