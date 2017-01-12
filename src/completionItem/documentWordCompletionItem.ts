'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ILuaEnumDefinition
} from '../scar';

export default class DocumentWordCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param func The ILuaFunctionDefinition.
	 */
	constructor(word: string)
	{
		super(word, CompletionItemKind.Text);

		this.documentation = 'keyword';
		this.detail = 'current document';
	}
}