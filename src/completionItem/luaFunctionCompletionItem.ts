'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ILuaFunctionDefinition
} from '../types';

import CompletionItemBase from './completionItemBase';

export default class LuaFunctionCompletionItem extends CompletionItemBase
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param func The ILuaFunctionDefinition.
	 */
	constructor(luaFunc: ILuaFunctionDefinition)
	{
		super(luaFunc.name, CompletionItemKind.Function);

		this.documentation = luaFunc.description;
		this.detail = luaFunc.signature;
	}
}