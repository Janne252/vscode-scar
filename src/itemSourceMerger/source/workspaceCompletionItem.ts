'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ISourceCompletionItem} from '../item/completionItem';
import WorkspaceLuaFunctionInformation from '../../luaWorkspaceParser/workspaceLuaFunctionInformation';

export default class WorkspaceCompletionItemSource extends ActiveItemSource<IWorkspaceCompletionItem>
{
    constructor(initialItems: IWorkspaceCompletionItem[] = [])
    {
        super('workspaceCompletioItemSource', initialItems);
    }

    public parserAddItem(info: WorkspaceLuaFunctionInformation): void
    {
        this.addItem(<IWorkspaceCompletionItem>{
            id: info.name,
            filepath: info.filepath,
            kind: CompletionItemKind.Module,
            label: info.name,
            detail: info.signature,
            documentation: info.description
        });
    }
}

export interface IWorkspaceCompletionItem extends ISourceCompletionItem
{
    filepath: string;
}