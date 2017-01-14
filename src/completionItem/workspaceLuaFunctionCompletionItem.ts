'use strict';

import {
    CompletionItem, CompletionList, CompletionItemKind,
	TextEdit,Command, 
} from 'vscode';

import {ILuaFunctionDefinition, ILuaFunctionDefinitionParameter} from '../scar';

/**
 * Represents a CompletionItem for a Workspace Lua Function.
 */
export default class WorkspaceLuaFunctionCompletionItem extends CompletionItem
{
    /**
     * The source file this CompletionItem originates from.
     */
    public source: string;
    /**
     * Creates a new completion item.
     *
     * Completion items must have at least a [label](#CompletionItem.label) which then
     * will be used as insert text as well as for sorting and filtering.
     *
     * @param name The name.
     * @param detail Additional details.
     * @param documentation Additional documentation.
     * @param source The source file of the lua function.
     */
    constructor(name: string, detail: string, documentation: string, source: string)
    {
        super(name, CompletionItemKind.Module);

        this.source = source;
        this.detail = detail;
        this.documentation = documentation;
    }
}