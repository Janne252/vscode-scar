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
    constructor(rootpath: string)
    {
        super('workspaceHovers_' + rootpath, []);
    }
    /**
     * Create Hover from WorkspaceLuaFunctionInformation.
     * @param info The info used to create the Hover.
     */
    public hoverFromFunctionInfo(info: WorkspaceLuaFunctionInformation): IWorkspaceHover
    {
        let line = info.range.start.line + 1;

        let examples = info.examples;
        let contents = [
            info.signature,
            info.rawDescription, 
            examples.length > 0 ? `**Examples**\n${examples}` : '', 
            `Defined: [${path.basename(info.filepath)}, Line ${line}](${Uri.file(info.filepath)}#L${line})`
        ];


        return <IWorkspaceHover>{
            id: 'workspace_' + info.name,
            name: info.name,
            filepath: info.filepath,
            contents: contents,
            range: info.range
        }
    }
}