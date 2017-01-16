'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import StaticItemSource from '../itemSourceMerger/staticSource';
import {ILuaConstsAutoDoc, ILuaFunctionDefinition} from '../scar';
import {ICompletionItem} from './completionItem';

import * as fs from 'fs';

/**
 * Represents a static source of LuaConstsAuto.scar CompletionItems.
 */
export default class LuaConstsAutoCompletionItemSource extends StaticItemSource<ICompletionItem>
{
    /**
     * Creates a new instance of LuaConstsAutoCompletionItemSource.
     * @param luaConstsAutoDoc The documentation to pull the blueprints from.
     */
	constructor(luaConstsAutoDoc: ILuaConstsAutoDoc)
	{
		super('luaConstsAutoCompletionItems', []);

        for(let blueprint of luaConstsAutoDoc.blueprints)
        {
            this.items.push(<ICompletionItem>{
                id: blueprint,
                kind: CompletionItemKind.Reference,
                label: blueprint,
                documentation: blueprint,
                detail: blueprint
            });
        }
	}
}