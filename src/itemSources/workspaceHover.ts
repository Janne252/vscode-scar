'use strict';

import {Uri} from 'vscode';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {IWorkspaceHover} from './hover';
import WorkspaceLuaFunctionInformation from '../luaWorkspaceParser/luaFunctionInformation';
import * as path from 'path';

export default class WorkspaceHoverSource extends ActiveItemSource<IWorkspaceHover>
{
    /**
     * Creates a new instance of WorkspaceCompletionItemSource.
     */
    constructor()
    {
        super('workspaceHovers', []);
    }
    /**
     * Create CompletionItem from WorkspaceLuaFunctionInformation.
     * @param info The info used to create the CompletionItem.
     */
    public hoverFromFunctionInfo(info: WorkspaceLuaFunctionInformation): IWorkspaceHover
    {
        return <IWorkspaceHover>{
            id: 'workspace_' + info.name,
            name: info.name,
            filepath: info.filepath,
            contents: [info.description, `[${path.basename(info.filepath)}](${Uri.file(info.filepath)}#L${info.range.start.line + 1})`],
            range: info.range
        }
    }
}