'use strict';

import {
    CompletionItemProvider, CompletionList, CompletionItem, CompletionItemKind,
    TextDocument, Position, CancellationToken
} from 'vscode';

import {
    ILuaDoc
} from './types';

import * as fs from 'fs';
import * as path from 'path';

export default class CompletionItemProver implements CompletionItemProvider
{
    public luaDocData: ILuaDoc = undefined;
    constructor()
    {

    }

    public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Thenable<CompletionList>
    {
        return new Promise((resolve, reject) => 
        {

        });
    }
}