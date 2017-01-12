'use strict';

import {SignatureHelp} from 'vscode';
import {IStaticSignatureHelpSource} from './signatureHelpSource';

export abstract class StaticSignatureHelpSourceBase<T> implements IStaticSignatureHelpSource
{
    protected source: T;
    protected signatureHelpItems: SignatureHelp[];
    protected signatureHelpDictionary: {[key: string]: SignatureHelp};

    constructor(source: T)
    {
        this.source = source;
    }

    protected processSource(): void
    {

    }

    public getSignatureHelp(name: string): SignatureHelp
    {
        return null;
    }  
}