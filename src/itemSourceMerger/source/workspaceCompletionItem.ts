'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ICompletionItem} from '../item/completionItem';
import WorkspaceLuaFunctionInformation from '../../luaWorkspaceParser/workspaceLuaFunctionInformation';

/**
 * Represents an active source of workspace CompletionItems.
 */
export default class WorkspaceCompletionItemSource extends ActiveItemSource<IWorkspaceCompletionItem>
{
    /**
     * Creates a new instance of WorkspaceCompletionItemSource.
     */
    constructor()
    {
        super('workspaceCompletioItemSource', []);
    }
    /**
     * Add a new item from the workspace parser.
     * @param info The info the workspace parser created.
     */
    public parserAddItem(info: WorkspaceLuaFunctionInformation): void
    {
        this.addItem(<IWorkspaceCompletionItem>{
            id: 'workspace_' + info.name,
            filepath: info.filepath,
            kind: CompletionItemKind.Module,
            label: info.name,
            detail: info.signature,
            documentation: info.description
        });
    }
}

/**
 * Base interface for Workspace CompletionItems.
 */
export interface IWorkspaceCompletionItem extends ICompletionItem
{
    /**
     * Path to the source file the CompletionItem originates from.
     */
    filepath: string;
}