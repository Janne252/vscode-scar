'use strict';

import {CompletionItem} from 'vscode';
import {ICompletionItemSourceMerger, ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource} from '../completionItemSource/completionItemSource';
import ArrayHelpers from '../helper/arrayHelpers';

export default class CompletionItemSourceMerger implements ICompletionItemSourceMerger
{
    protected staticSources: IStaticCompletionItemSource[] = [];
    protected activeSources: IActiveCompletionItemSource[] = [];

    protected completionItems: CompletionItem[];

    constructor()
    {
        this.completionItems = [];
    }

    protected addCompletionItems(items: CompletionItem[]): void
    {
        this.completionItems = this.completionItems.concat(items);
    }

    protected removeCompletionItems(items: CompletionItem[]): void
    {
        ArrayHelpers.removeMany(this.completionItems, items);
    }

    public addStaticSource(source: IStaticCompletionItemSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.staticSources.push(source);
            
            source.init().then(() => 
            {
                this.addCompletionItems(source.getCompletionItems());

                resolve();
            });
        });
    }

    public removeStaticSource(source: IStaticCompletionItemSource): void
    {
        this.removeCompletionItems(source.getCompletionItems());
       
        ArrayHelpers.remove(this.staticSources, source);
    }

    public addActiveSource(source: IActiveCompletionItemSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            source.merger = this;
            this.activeSources.push(source);

            source.init().then(() => 
            {
                this.addCompletionItems(source.getCompletionItems());

                resolve();
            });
        });
    }

    public removeActiveSource(source: IActiveCompletionItemSource): void
    {
        source.merger = undefined;
        this.removeCompletionItems(source.getCompletionItems());

        ArrayHelpers.remove(this.activeSources, source);
    }

    public init()
    {
        this.completionItems = [];

        for(let source of this.staticSources)
        {
            this.addCompletionItems(source.getCompletionItems());
        }

        for(let source of this.activeSources)
        {
            this.addCompletionItems(source.getCompletionItems());
        }
    }

    public activeSourceUpdated(source: IActiveCompletionItemSource): void
    {
        let removeItems = source.getPreviousCompletionItems();

        this.removeCompletionItems(removeItems);

        this.addCompletionItems(source.getCompletionItems());
    }

    public getCompletionItems(): CompletionItem[]
    {
        return this.completionItems;
    }
}