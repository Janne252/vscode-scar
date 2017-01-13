'use strict';

import {CompletionItem} from 'vscode';
import {ICompletionItemSourceMerger, ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource} from '../completionItemSource/completionItemSource';
import ArrayHelpers from '../helper/arrayHelpers';

/**
 * Merges a collection of static and active CompletionItem sources.
 */
export default class CompletionItemSourceMerger implements ICompletionItemSourceMerger
{
    /**
     * Collection of static sources.
     */
    protected staticSources: IStaticCompletionItemSource[] = [];
    /**
     * Collection of active sources.
     */
    protected activeSources: IActiveCompletionItemSource[] = [];
    /**
     * Collection of the merged COmpletionItems.
     */
    protected completionItems: CompletionItem[];
    /**
     * Creates a new instance of CompletionItemSourceMerger.
     */
    constructor()
    {
        this.completionItems = [];
    }
    /**
     * Internally adds a collection of CompletionItems.
     * @param items The CompletionItems to add.
     */
    protected addCompletionItems(items: CompletionItem[]): void
    {
        this.completionItems = this.completionItems.concat(items);
    }
    /**
     * Internally removes a collection of CompletionItems.
     * @param items The CompletionItems to remove.
     */
    protected removeCompletionItems(items: CompletionItem[]): void
    {
        ArrayHelpers.removeMany(this.completionItems, items);
    }
    /**
     * Adds a static COmpletionItem source to this merger.
     * @param source The source to add.
     */
    public addStaticSource(source: IStaticCompletionItemSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.staticSources.push(source);
            
            source.load().then(() => 
            {
                this.addCompletionItems(source.getCompletionItems());

                resolve();
            });
        });
    }
    /**
     * Removes a static COmpletionItem source from this merger.
     * @param source The source to remove.
     */
    public removeStaticSource(source: IStaticCompletionItemSource): void
    {
        this.removeCompletionItems(source.getCompletionItems());
       
        ArrayHelpers.remove(this.staticSources, source);
    }
    /**
     * Adds an active COmpletionItem source to this merger.
     * @param source The source to add.
     */
    public addActiveSource(source: IActiveCompletionItemSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            source.merger = this;
            this.activeSources.push(source);

            source.load().then(() => 
            {
                this.addCompletionItems(source.getCompletionItems());

                resolve();
            });
        });
    }
    /**
     * Removes an active COmpletionItem source from this merger.
     * @param source The source to remove.
     */
    public removeActiveSource(source: IActiveCompletionItemSource): void
    {
        source.merger = undefined;
        this.removeCompletionItems(source.getCompletionItems());

        ArrayHelpers.remove(this.activeSources, source);
    }
    /**
     * Called by active sources when they change.
     */
    public activeSourceUpdated(source: IActiveCompletionItemSource): void
    {
        let removeItems = source.getPreviousCompletionItems();

        this.removeCompletionItems(removeItems);

        this.addCompletionItems(source.getCompletionItems());
    }
    /**
     * Returns all the COmpletionItems from all the sources.
     */
    public getCompletionItems(): CompletionItem[]
    {
        return this.completionItems;
    }
}