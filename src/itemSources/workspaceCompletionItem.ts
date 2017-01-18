'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {ICompletionItem} from './completionItem';
import WorkspaceLuaFunctionInformation from '../luaWorkspaceParser/luaFunctionInformation';
import {IWorkspaceCompletionItem} from './completionItem';
/**
 * Active source of CompletionItems from a workspace.
 */
export default class WorkspaceCompletionItemSource extends ActiveItemSource<IWorkspaceCompletionItem>
{
    /**
     * Creates a new instance of WorkspaceCompletionItemSource.
     */
    constructor(rootpath: string)
    {
        super('workspaceCompletioItems_' + rootpath, []);
    }
    /**
     * Create CompletionItem from WorkspaceLuaFunctionInformation.
     * @param info The info used to create the CompletionItem.
     */
    public completionItemFromFunctionInfo(info: WorkspaceLuaFunctionInformation): IWorkspaceCompletionItem
    {
        return <IWorkspaceCompletionItem>{
            id: 'workspace_' + info.name,
            name: info.name,
            filepath: info.filepath,
            kind: CompletionItemKind.Module,
            label: info.name,
            detail: info.signature,
            documentation: info.description
        }
    }
}