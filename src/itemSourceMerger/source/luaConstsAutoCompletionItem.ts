'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ILuaConstsAutoDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

import * as fs from 'fs';

/**
 * Represents a static source of LuaConstsAuto.scar CompletionItems.
 */
export default class LuaConstsAutoCompletionItemSource extends StaticItemSource<ISourceCompletionItem>
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