'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ILuaEnumDefinition
} from '../scar';

/**
 * Represents a CompletionItem for a LuaDoc Enum.
 */
export default class LuaEnumCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param luaEnum The ILuaEnumDefinition.
	 */
	constructor(luaEnum: ILuaEnumDefinition)
	{
		super(luaEnum.name, luaEnum.kind);

		this.documentation = luaEnum.description;
		this.detail = luaEnum.description;
	}
}