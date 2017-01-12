'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ISCAREnumDefinition
} from '../scar';

export default class SCARBlueprintCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param func The ILuaFunctionDefinition.
	 */
	constructor(blueprint: string)
	{
		super(blueprint, CompletionItemKind.Reference);

		this.documentation = blueprint;
		this.detail = blueprint;
	}
}