'use strict';

import {CompletionItem} from 'vscode';
import {ICompletionItemSourceMerger, ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource} from './completionItemSource';

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
        for(let i = this.completionItems.length - 1; i <= 0; i--)
        {
            for(let item of items)
            {
                if (this.completionItems[i] == item)
                {
                    this.completionItems.splice(i, 1);
                }
            }
        }
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
        
        for(let i = this.staticSources.length - 1; i >= 0; i--)
        {
            if (this.activeSources[i] == source)
            {
                this.activeSources.splice(i, 1);
            }
        }
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
        
        for(let i = this.activeSources.length - 1; i >= 0; i--)
        {
            if (this.activeSources[i] == source)
            {
                this.activeSources.splice(i, 1);
            }
        }
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