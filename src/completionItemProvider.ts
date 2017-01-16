'use strict';

import {
    CompletionItemProvider as ICompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind,
    TextDocument, Position, CancellationToken
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import ItemSourceMerger from './itemSourceMerger/itemSourceMerger';
import {ICompletionItem} from './itemSourceMerger/item/completionItem';

export default class CompletionItemProvider implements ICompletionItemProvider
{
    protected merger: ItemSourceMerger<ICompletionItem>;
    constructor(merger: ItemSourceMerger<ICompletionItem>)
    {
        this.merger = merger;
    }

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList>
    {
        return new Promise((resolve, reject) => 
        {
            resolve(this.merger.getAllItems());
        });
    }
}