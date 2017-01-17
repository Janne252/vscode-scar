'use strict';

import {
    CompletionItemProvider as ICompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind,
    TextDocument, Position, CancellationToken
} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import ItemSourceMerger from './itemSourceMerger/merger';
import {ICompletionItem} from './itemSources/completionItem';
import {DumpJSON} from './scar';

export default class CompletionItemProvider implements ICompletionItemProvider
{
    protected merger: ItemSourceMerger<ICompletionItem>;
    constructor(merger: ItemSourceMerger<ICompletionItem>)
    {
        this.merger = merger;
    }

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): CompletionItem[]
    {
        let result = this.merger.getAllItems();
        console.log('Returning ' + result.length + ' CompletionItems');

        DumpJSON(result);
        return result;
    }
}