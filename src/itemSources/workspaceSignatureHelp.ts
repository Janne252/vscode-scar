'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../scar';
import {IWorkspaceSignatureHelp} from './signatureHelp';
import WorkspaceLuaFunctionInformation from '../luaWorkspaceParser/luaFunctionInformation';
import {LuaDocSignatureHelpSource} from './luaDocSignatureHelp';

/**
 * Active source of SignatureHelp items from a workspace.
 */
export default class WorkspaceSignatureHelpSource extends ActiveItemSource<IWorkspaceSignatureHelp>
{
    /**
     * Creates a new instance of WorkspaceSignatureHelpSource.
     */
    constructor()
    {
        super('workspaceSignatureHelpItems', []);
    }
    /**
     * Creates SignatureHelp from WorkspaceLuaFunctionInformation.
     * @param info The info used to create the SignatureHelp.
     */
    public signatureHelpFromFunctionInfo(info: WorkspaceLuaFunctionInformation): IWorkspaceSignatureHelp
    {
        let parameters = this.getParameters(info);

        return <IWorkspaceSignatureHelp>{
            id: 'workspace_' + info.name,
            name: info.name,
            filepath: info.filepath,
            activeParameter: 0,
            activeSignature: 0,
            signatures: [
                {
                    label: info.signature,
                    documentation: info.description,
                    parameters: parameters
                }
            ],
            parameterCount: parameters.length,
            lastParameterIsList: false
        };
    }   
    /**
     * Internally creates a parameter array of a parsed function.
     * @param info The parsed function information.
     */
    protected getParameters(info: WorkspaceLuaFunctionInformation): ParameterInformation[]
    {
        let result: ParameterInformation[] = [];
        
        for(let param of info.parameters)
        {
            result.push({
                label: param.name,
                documentation: param.description
            });
        }

        return result;
    }
}

