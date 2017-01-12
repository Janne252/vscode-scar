'use strict';

import {CompletionItem} from 'vscode';
import {IActiveCompletionItemSource, ICompletionItemSourceMerger} from './completionItemSource';
import {StaticCompletionItemSourceBase} from './staticCompletionItemSourceBase';

/**
 * Abstract base class for providing a source for active completion items.
 */
export abstract class ActiveCompletionItemSourceBase extends StaticCompletionItemSourceBase implements IActiveCompletionItemSource
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
    /**
     * Notifies the merger by calling its .activeSourceUpdated method.
     */
    protected notifyMerger(): void
    {
        if (this.merger !== undefined)
        {
            this.merger.activeSourceUpdated(this);
        }
    }

    /**
     * Returns the previous (before update) completion items.
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
    /**
     * Removes all the completion items from the source.
     */
    public clear(): void
    {
        this.previousCompletionItems = this.completionItems;
        this.completionItems = [];

        this.notifyMerger();
    }
}