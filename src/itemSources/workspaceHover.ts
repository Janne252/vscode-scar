'use strict';

import {Uri} from 'vscode';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {IWorkspaceHover} from './hover';
import WorkspaceLuaFunctionInformation from '../luaWorkspaceParser/luaFunctionInformation';
import * as path from 'path';

/**
 * Active source of Hover items from a workspace.
 */
export default class WorkspaceHoverSource extends ActiveItemSource<IWorkspaceHover>
{
    /**
     * Creates a new instance of WorkspaceHoverSource.
     */
    constructor()
    {
        super('workspaceHovers', []);
    }
    /**
     * Create Hover from WorkspaceLuaFunctionInformation.
     * @param info The info used to create the Hover.
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