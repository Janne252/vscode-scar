'use strict';

import {CompletionItem} from 'vscode';
import {IActiveCompletionItemSource, ICompletionItemSourceMerger} from './completionItemSource';
import {CompletionItemSourceBase} from './completionItemSourceBase';

/**
 * Abstract base class for providing a source for active completion items.
 */
export abstract class ActiveCompletionItemSourceBase extends CompletionItemSourceBase implements IActiveCompletionItemSource
{
    protected previousCompletionItems: CompletionItem[];
    
    public merger: ICompletionItemSourceMerger;
    
    constructor()
    {
        super();

        this.previousCompletionItems = [];
    }

    public getPreviousCompletionItems(): CompletionItem[]
    {
        return this.previousCompletionItems;
    }

    public updateCompletionItems(items: CompletionItem[]): void
    {
        this.previousCompletionItems = this.completionItems;
        this.completionItems = items;

        if (this.merger !== undefined)
        {
            this.merger.activeSourceUpdated(this);
        }
    }
}