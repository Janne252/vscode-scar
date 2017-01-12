'use strict';

import {SignatureHelp} from 'vscode';
import {IStaticSignatureHelpSource} from './signatureHelpSource';
import {ILoadableSource} from '../scar';
import NamedSignatureHelp from '../signatureHelp/namedSignatureHelp';

export abstract class StaticSignatureHelpSourceBase<T extends ILoadableSource<void>> implements IStaticSignatureHelpSource
{
    protected _isReady: boolean = false;
    public get isReady():boolean
    {
        return this._isReady;
    }

    protected source: T;
    protected signatureHelpItems: NamedSignatureHelp[];

    constructor(source: T)
    {
        this.source = source;
        this.signatureHelpItems = [];
    }

    protected processData(): void
    {

    }

    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            this.source.load().then(() => 
            {
                this.processData();
            });
        });
    }

    public getSignatureHelpItems(): NamedSignatureHelp[]
    {
        return this.signatureHelpItems;
    }  
}