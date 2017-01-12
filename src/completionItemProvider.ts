'use strict';

import {
    CompletionItemProvider as ICompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind,
    TextDocument, Position, CancellationToken
} from 'vscode';

import {
    ILuaDoc
} from './scar';

import CompletionItemSourceMerger from './completionItemSourceMerger/completionItemSourceMerger';

import * as fs from 'fs';
import * as path from 'path';

export default class CompletionItemProvider implements ICompletionItemProvider
{
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