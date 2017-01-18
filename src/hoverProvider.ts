'use strict';

import ItemSourceMerger from './itemSourceMerger/merger';
import {IHover} from './itemSources/hover';

import {Hover, HoverProvider as IHoverProvider, TextDocument, Position, CancellationToken} from 'vscode';

export default class HoverProvider implements IHoverProvider
{
    protected merger: ItemSourceMerger<IHover>;

    constructor(merger: ItemSourceMerger<IHover>)
    {
        this.merger = merger;
    }

    public provideHover(document: TextDocument, position: Position, token: CancellationToken): Hover
    {
        let word = document.getText(document.getWordRangeAtPosition(position));

        return this.merger.getItem((item) => item.name == word);
    }
}