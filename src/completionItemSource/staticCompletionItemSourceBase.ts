'use strict';

import {CompletionItem} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {IStaticCompletionItemSource} from './completionItemSource';

/**
 * Abstract base class for providing a source for static completion items.
 */
export abstract class StaticCompletionItemSourceBase implements IStaticCompletionItemSource
{
    protected _isReady: boolean = false;
    /**
     * Whether or not the source has fully loaded.
     */
    public get isReady():boolean
    {
        return this._isReady;
    }
    /**
     * Array containing the actual CompletionItems.
     */
    protected completionItems: CompletionItem[];

    /**
     * Creates a new instance of CompletionSourceBase.
     */
    constructor()
    {
        this.completionItems = [];
    }
    /**
     * Loads the data and processes it.
     */
    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            resolve();
        });
    }

    /**
     * Returns the CompletionItems.
     */
    public getCompletionItems(): CompletionItem[]
    {
        return this.completionItems;
    }
}