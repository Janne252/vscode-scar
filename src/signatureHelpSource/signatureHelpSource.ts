'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';
import NamedSignatureHelp from '../signatureHelp/namedSignatureHelp';

export interface ISignatureHelpSource
{
    isReady: boolean;
    getSignatureHelpItems(): NamedSignatureHelp[];
    load(): Thenable<void>;
}

export interface IStaticSignatureHelpSource extends ISignatureHelpSource
{
    
}

export interface IActiveSignatureHelpSource extends IStaticSignatureHelpSource
{
    getPreviousSignatureHelpItems(): NamedSignatureHelp[];
    updateSignatureHelpItems(items: NamedSignatureHelp[]): void;
    merger: ISignatureHelpSourceMerger;

    addSignatureHelpItem(item: NamedSignatureHelp): void;
    removeSignatureHelpItem(item: NamedSignatureHelp): void;
    clear(): void;
}

export interface ISignatureHelpSourceMerger
{
    addStaticSource(source: IStaticSignatureHelpSource): Thenable<void>;
    removeStaticSource(source: IStaticSignatureHelpSource): void;
    addActiveSource(source: IActiveSignatureHelpSource): Thenable<void>;
    removeActiveSource(source: IActiveSignatureHelpSource): void;

    activeSourceUpdated(source: IActiveSignatureHelpSource): void;

    getSignatureHelp(name: string): NamedSignatureHelp;
}

