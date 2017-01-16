'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {ICompletionItem} from './completionItem';
import WorkspaceLuaFunctionInformation from '../luaWorkspaceParser/workspaceLuaFunctionInformation';
import {IWorkspaceCompletionItem} from './completionItem';
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
        super('workspaceCompletioItems', []);
    }
    /**
     * Add a new item from the workspace parser.
     * @param info The info the workspace parser created.
     */
    public parserAddItem(info: WorkspaceLuaFunctionInformation): void
    {
        this.addItem(<IWorkspaceCompletionItem>{
            id: 'workspace_' + info.name,
            name: info.name,
            filepath: info.filepath,
            kind: CompletionItemKind.Module,
            label: info.name,
            detail: info.signature,
            documentation: info.description
        });
    }
}