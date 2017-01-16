'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ILuaDoc, ISCARDoc, ILuaFunctionDefinition, ILuaEnumDefinition, ISCADOCREnumDefinition} from '../../scar';
import {ICompletionItem} from '../item/completionItem';

class DocCompletionItemSource extends StaticItemSource<ICompletionItem>
{
	constructor(id: string, doc: ILuaDoc | ISCARDoc)
	{
		super(id, []);

		for (let func of doc.functions)
		{
			this.items.push(<ICompletionItem>{
				id: func.name,
				kind: CompletionItemKind.Function,
				label: func.name,
				detail: func.signature,
				documentation: func.description
			});
		}

		for(let luaEnum of doc.enums)
		{	
			let kind: CompletionItemKind;

			this.items.push(<ICompletionItem>{
				id: luaEnum.name,
				kind: luaEnum.kind !== undefined ? luaEnum.kind : CompletionItemKind.Enum,
                label: luaEnum.name,
				detail: luaEnum.description !== undefined ? luaEnum.description : luaEnum.type,
				documentation: luaEnum.description !== undefined ? luaEnum.description : `${luaEnum.name} of type ${luaEnum.type}`
			});
		}
	}
}

/**
 * Represents a static source of Lua documentation CompletionItems.
 */
export class LuaDocCompletionItemSource extends DocCompletionItemSource
{
	/**
	 * Creates a new instance of LuaDocCompletionItemSource.
	 * @param luaDoc The Lua documentation to pull the information from.
	 */
	constructor(luaDoc: ILuaDoc)
	{
		super('luaDocCompletionItems' ,luaDoc);
	}
}

/**
 * Represents a static source of SCARDoc documentation CompletionItems.
 */
export class SCARDocCompletionItemSource extends DocCompletionItemSource
{
	/**
	 * Creates a new instance of SCARDocCompletionItemSource.
	 * @param scarDoc The SCARDoc to pull the information from.
	 */
	constructor(scarDoc: ISCARDoc)
	{
		super('scarDocCompletionItems', scarDoc);
	}
}