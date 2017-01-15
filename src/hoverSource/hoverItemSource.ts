'use strict';

import {Hover} from 'vscode';

export interface IhoverItemSource
{
    isReady: boolean;
    getHoverItems(): Hover[];
    load(): Thenable<void>;
}

export interface IStaticHoverItemSource extends IhoverItemSource
{
    
}

export interface IActiveHoverItemSource extends IStaticHoverItemSource
{
    getPreviousHoverItems(): Hover[];
    updateHoverHelpItems(items: Hover[]): void;
    merger: IHoverItemSourceMerger;

    addSHoverItem(item: Hover): void;
    removeHoverItem(item: Hover): void;

    removeHoverItems(comparer: IHoverItemComparer): void;
    clear(): void;
}

export interface IHoverItemSourceMerger
{
    addStaticSource(source: IStaticHoverItemSource): Thenable<void>;
    removeStaticSource(source: IStaticHoverItemSource): void;
    addActiveSource(source: IActiveHoverItemSource): Thenable<void>;
    removeActiveSource(source: IActiveHoverItemSource): void;

    activeSourceUpdated(source: IActiveHoverItemSource): void;

    getHoverItem(name: string): Hover;
}

export interface IHoverItemComparer
{
    (item: Hover): boolean;
}
