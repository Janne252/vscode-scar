'use strict';

import {IActiveSignatureHelpSource, ISignatureHelpSourceMerger} from './signatureHelpSource';
import NamedSignatureHelp from '../signatureHelp/namedSignatureHelp';

export abstract class ActiveSignatureHelpSourceBase implements IActiveSignatureHelpSource
{
    protected _isReady: boolean = false;
    public get isReady(): boolean
    {
        return this._isReady;
    }

    protected previousSignatureHelpItems: NamedSignatureHelp[];
    protected signatureHelpItems: NamedSignatureHelp[];
    
    public merger: ISignatureHelpSourceMerger;
    
    constructor()
    {
        this.previousSignatureHelpItems = [];
        this.signatureHelpItems = [];
    }

    public getPreviousSignatureHelpItems(): NamedSignatureHelp[]
    {
        return this.signatureHelpItems;
    }

    public updateSignatureHelpItems(items: NamedSignatureHelp[]): void
    {
        this.previousSignatureHelpItems = this.signatureHelpItems;
        this.signatureHelpItems = items;

        if (this.merger !== undefined)
        {
            this.merger.activeSourceUpdated(this);
        }
    }

    public getSignatureHelpItems(): NamedSignatureHelp[]
    {
        return this.signatureHelpItems;
    }

    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            resolve();
        });
    }

    public addSignatureHelpItem(item: NamedSignatureHelp): void
    {
        let newItems = Array.from(this.signatureHelpItems);

        let found = false;
        
        for(let i = newItems.length - 1; i >= 0; i--)
        {
            if (newItems[i].name == item.name)
            {
                newItems.splice(i, 1);
            }
        }

        newItems.push(item);

        this.updateSignatureHelpItems(newItems);
    }

    public removeSignatureHelpItem(item: NamedSignatureHelp): void
    {
        let newItems = Array.from(this.signatureHelpItems);

        for(let i = newItems.length - 1; i >= 0; i--)
        {
            if (newItems[i] == item)
            {
                newItems.splice(i, 1);
            }
        }
       
       this.updateSignatureHelpItems(newItems);
    }
}