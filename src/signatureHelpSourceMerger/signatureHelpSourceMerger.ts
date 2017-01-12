'use strict';

import {SignatureHelp} from 'vscode';
import {ISignatureHelpSourceMerger, IStaticSignatureHelpSource, IActiveSignatureHelpSource} from '../signatureHelpSource/signatureHelpSource';
import ArrayHelpers from '../helper/arrayHelpers';

export default class SignatureHelpSourceMerger implements ISignatureHelpSourceMerger
{
    protected staticSources: IStaticSignatureHelpSource[] = [];
    protected activeSources: IActiveSignatureHelpSource[] = [];

    protected signatureHelpItems: SignatureHelp[];

    constructor()
    {
        this.signatureHelpItems = [];
    }

    protected addSignatureHelpItems(items: SignatureHelp[]): void
    {
        this.signatureHelpItems = this.signatureHelpItems.concat(items);
    }

    protected removeSignatureHelpItems(items: SignatureHelp[]): void
    {
        ArrayHelpers.removeMany(this.signatureHelpItems, items);
    }

    public addStaticSource(source: IStaticSignatureHelpSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.staticSources.push(source);
            
            source.load().then(() => 
            {
                this.addSignatureHelpItems(source.getSignatureHelpItems());

                resolve();
            });
        });
    }

    public removeStaticSource(source: IStaticSignatureHelpSource): void
    {
        this.removeCompletionItems(source.getCompletionItems());
       
        ArrayHelpers.remove(this.staticSources, source);
    }

    public addActiveSource(source: IActiveSignatureHelpSource): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            source.merger = this;
            this.activeSources.push(source);

            source.load().then(() => 
            {
                this.add(source.get());

                resolve();
            });
        });
    }

    public removeActiveSource(source: IActiveSignatureHelpSource): void
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