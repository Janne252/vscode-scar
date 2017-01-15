'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ILuaDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

export default class LuaDocCompletionItemSource extends StaticItemSource<ISourceCompletionItem>
{
	constructor(luaDoc: ILuaDoc)
	{
		super('luaDocCompletionItems', []);

		for (let func of luaDoc.functions)
		{
			this.items.push(<ISourceCompletionItem>{
				id: func.name,
				kind: CompletionItemKind.Function,
				label: func.name,
				detail: func.signature,
				documentation: func.description
			});
		}

		for(let luaEnum of luaDoc.enums)
		{	
			this.items.push(<ISourceCompletionItem>{
				id: luaEnum.name,
				kind: luaEnum.kind,
                label: luaEnum.name,
				detail: luaEnum.description,
				documentation: luaEnum.description
			});
		}	
	}
}
