'use strict';

import {CompletionItem} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ICompletionItemSource} from './completionItemSource';

export abstract class CompletionItemSourceBase implements ICompletionItemSource
{
    protected completionItems: CompletionItem[];

    constructor()
    {
        this.completionItems = [];
    }

    public init(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            resolve();
        });
    }

    public getCompletionItems(): CompletionItem[]
    {
        return this.completionItems;
    }
}