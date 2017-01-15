'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {
    ISCADOCREnumDefinition
} from '../scar';

/**
 * Represents a CompletionItem for a SCAR/LuaConstsAuto.scar Blueprint.
 */
export default class SCARBlueprintCompletionItem extends CompletionItem
{
	/**
	 * Creates a new completion item.
	 *
	 * Completion items must have at least a [label](#CompletionItem.label) which then
	 * will be used as insert text as well as for sorting and filtering.
	 *
	 * @param blueprint The blueprint.
	 */
	constructor(blueprint: string)
	{
		super(blueprint, CompletionItemKind.Reference);

		this.documentation = blueprint;
		this.detail = blueprint;
	}
}