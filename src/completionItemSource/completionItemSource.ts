'use strict';

import {CompletionItem} from 'vscode';

export interface ICompletionItemSource
{
    getCompletionItems(): CompletionItem[]
    init(): Thenable<void>;
}

export interface IStaticCompletionItemSource extends ICompletionItemSource
{

}

export interface IActiveCompletionItemSource extends IStaticCompletionItemSource
{
    getPreviousCompletionItems(): CompletionItem[];
    updateCompletionItems(items: CompletionItem[]): void;
    merger: ICompletionItemSourceMerger;
}

export interface ICompletionItemSourceMerger
{
    addStaticSource(source: ICompletionItemSource): Thenable<void>;
    removeStaticSource(source: ICompletionItemSource): void;
    addActiveSource(source: IActiveCompletionItemSource): Thenable<void>;
    removeActiveSource(source: IActiveCompletionItemSource): void;

    activeSourceUpdated(source: IActiveCompletionItemSource): void;

    getCompletionItems(): CompletionItem[];
}