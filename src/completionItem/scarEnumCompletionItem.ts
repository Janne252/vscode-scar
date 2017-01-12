'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ISCAREnumDefinition
} from '../scar';

export default class SCAREnumCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param func The ILuaFunctionDefinition.
	 */
	constructor(scarEnum: ISCAREnumDefinition)
	{
		super(scarEnum.name, CompletionItemKind.Enum);

		this.documentation = `${scarEnum.name} of type ${scarEnum.type}`;
		this.detail = scarEnum.type;
	}
}