'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ILuaFunctionDefinition
} from '../scar';

export default class WorkspaceLuaFunctionCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param func The ILuaFunctionDefinition.
	 */
	constructor(name: string, detail: string, documentation: string)
	{
		super(name, CompletionItemKind.Function);

        this.detail = detail;
		this.documentation = documentation;
	}
}