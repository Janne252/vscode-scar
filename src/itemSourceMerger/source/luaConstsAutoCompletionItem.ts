'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ILuaConstsAutoDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

import * as fs from 'fs';

export default class LuaConstsAutoCompletionItemSource extends StaticItemSource<ISourceCompletionItem>
{
	constructor(luaConstsAutoDoc: ILuaConstsAutoDoc)
	{
		super('luaConstsAutoCompletionItems', []);

        for(let blueprint of luaConstsAutoDoc.blueprints)
        {
            this.items.push(<ISourceCompletionItem>{
                id: blueprint,
                kind: CompletionItemKind.Reference,
                label: blueprint,
                documentation: blueprint,
                detail: blueprint
            });
        }
	}
}