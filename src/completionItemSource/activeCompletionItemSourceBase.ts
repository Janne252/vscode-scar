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
    
    /**
     * The merger to notify when this source changes.
     */
    public merger: ICompletionItemSourceMerger;
    
    /**
     * Creates a new instance of ActiveCompletionItemSourceBase.
     */
    constructor()
    {
        super();

        this.previousCompletionItems = [];
    }

    protected notifyMerger(): void
    {
        if (this.merger !== undefined)
        {
            this.merger.activeSourceUpdated(this);
        }
    }

    /**
     * Retrieves the previous (before update) completion items.
     * @returns The previous completion items.
     */
    public getPreviousCompletionItems(): CompletionItem[]
    {
        return this.previousCompletionItems;
    }
    /**
     * Updates the completion items.
     * @param items The items to replace the current items with.
     */
    public updateCompletionItems(items: CompletionItem[]): void
    {
        this.previousCompletionItems = this.completionItems;
        this.completionItems = items;

        this.notifyMerger();
    }
    /**
     * Adds a completion item.
     * @param item The item to add.
     */
    public addCompletionItem(item: CompletionItem): void
    {
        let newItems = Array.from(this.completionItems);

        for(let i = newItems.length - 1; i >= 0; i--)
        {
            if (newItems[i].label == item.label && newItems[i].kind == item.kind)
            {
                newItems.splice(i, 1);
            }
        }

        newItems.push(item);

        this.updateCompletionItems(newItems);
    }
    /**
     * Removes a completion item.
     * @param item The item to remove.
     */
    public removeCompletionItem(item: CompletionItem): void
    {
        let newItems = Array.from(this.completionItems);

        for(let i = newItems.length - 1; i >= 0; i--)
        {
            if (newItems[i] == item)
            {
                newItems.splice(i, 1);
            }
        }
       
       this.updateCompletionItems(newItems);
    }

    public clear(): void
    {
        this.previousCompletionItems = this.completionItems;
        this.completionItems = [];

        this.notifyMerger();
    }
}