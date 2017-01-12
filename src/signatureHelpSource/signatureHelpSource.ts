'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';

export interface ISignatureHelpSource
{
    getSignatureHelp(name: string): SignatureHelp;
}

export interface IStaticSignatureHelpSource extends ISignatureHelpSource
{

}

export interface IActiveSignatureHelpSource extends IStaticSignatureHelpSource
{
    updateSignatureHelp(items: SignatureHelp[]): void;
}

export interface ISignatureHelpSourceMerger
{
    addStaticSource(source: IStaticSignatureHelpSource): Thenable<void>;
    removeStaticSource(source: IStaticSignatureHelpSource): void;
    addActiveSource(source: IActiveSignatureHelpSource): Thenable<void>;
    removeActiveSource(source: IActiveSignatureHelpSource): void;

    activeSourceUpdated(source: IActiveSignatureHelpSource): void;

    getSignatureHelp(name: string): SignatureHelp;
}
