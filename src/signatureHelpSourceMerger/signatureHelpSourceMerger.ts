'use strict';

import {SignatureHelp} from 'vscode';
import {ISignatureHelpSourceMerger, IStaticSignatureHelpSource, IActiveSignatureHelpSource} from '../signatureHelpSource/signatureHelpSource';
import ArrayHelpers from '../helper/arrayHelpers';
import NamedSignatureHelp from '../signatureHelp/namedSignatureHelp';

export default class SignatureHelpSourceMerger implements ISignatureHelpSourceMerger
{
    protected staticSources: IStaticSignatureHelpSource[] = [];
    protected activeSources: IActiveSignatureHelpSource[] = [];

    protected signatureHelpItemCache: {[key: string]: NamedSignatureHelp};

    protected signatureHelpItems: NamedSignatureHelp[];

    constructor()
    {
        this.signatureHelpItems = [];
        this.signatureHelpItemCache = {};
    }

    protected addSignatureHelpItems(items: NamedSignatureHelp[]): void
    {
        this.signatureHelpItems = this.signatureHelpItems.concat(items);
    }

    protected removeSignatureHelpItems(items: NamedSignatureHelp[]): void
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
        this.removeSignatureHelpItems(source.getSignatureHelpItems());
       
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
                this.addSignatureHelpItems(source.getSignatureHelpItems());

                resolve();
            });
        });
    }

    public removeActiveSource(source: IActiveSignatureHelpSource): void
    {
        source.merger = undefined;
        this.removeSignatureHelpItems(source.getSignatureHelpItems());

        ArrayHelpers.remove(this.activeSources, source);
    }

    public activeSourceUpdated(source: IActiveSignatureHelpSource): void
    {
        let removeItems = source.getPreviousSignatureHelpItems();

        this.removeSignatureHelpItems(removeItems);

        this.addSignatureHelpItems(source.getSignatureHelpItems());
    }

    public getSignatureHelp(name: string): NamedSignatureHelp
    {
        if (this.signatureHelpItemCache[name] === undefined)
        {
            for(let item of this.signatureHelpItems)
            {
                if (item.name == name)
                {
                    this.signatureHelpItemCache[name] = item;
                }
            }
        }

        return this.signatureHelpItemCache[name];
    }
}