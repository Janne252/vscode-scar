'use strict';

import {SignatureHelp} from 'vscode';
import {IStaticSignatureHelpSource} from './signatureHelpSource';
import {ILoadableSource} from '../scar';

export abstract class StaticSignatureHelpSourceBase<T extends ILoadableSource<void>> implements IStaticSignatureHelpSource
{
    protected _isReady: boolean = false;
    public get isReady():boolean
    {
        return this._isReady;
    }

    protected source: T;
    protected signatureHelpItems: SignatureHelp[];
    protected signatureHelpDictionary: {[key: string]: SignatureHelp};

    constructor(source: T)
    {
        this.source = source;
        this.signatureHelpItems = [];
        this.signatureHelpDictionary = {};
    }

    protected processData(): void
    {

    }

    protected signatureHelpMatchesName(signatureHelp: SignatureHelp, name: string): boolean
    {
        return false;
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

    public getSignatureHelp(name: string): SignatureHelp
    {
        if (this.signatureHelpDictionary[name] === undefined)
        {
            for(let signatureHelp of this.signatureHelpItems)
            {
                if (this.signatureHelpMatchesName(signatureHelp, name))
                {
                    this.signatureHelpDictionary[name] = signatureHelp;
                }
            }
        }

        return this.signatureHelpDictionary[name];
    }  
}