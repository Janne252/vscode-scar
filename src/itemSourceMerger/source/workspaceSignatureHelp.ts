'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceSignatureHelp} from '../item/signatureHelp';
import WorkspaceLuaFunctionInformation from '../../luaWorkspaceParser/workspaceLuaFunctionInformation';
import {LuaDocSignatureHelpSource} from './luaDocSignatureHelp';

export default class WorkspaceSignatureHelpSource extends ActiveItemSource<IWorkspaceSignatureHelp>
{
	constructor()
	{
		super('workspaceSignatureHelp', []);
	}

    public parserAddItem(info: WorkspaceLuaFunctionInformation): void
    {   
        let parameters = this.getParameters(info);

        this.addItem(<IWorkspaceSignatureHelp>{
            id: info.name,
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
        });
    }

    protected getParameters(func: WorkspaceLuaFunctionInformation): ParameterInformation[]
    {
        let result: ParameterInformation[] = [];
        
        for(let param of func.parameters)
        {
            result.push({
                label: param.name,
                documentation: param.description
            });
        }

        return result;
    }
}

export interface IWorkspaceSignatureHelp extends ISourceSignatureHelp
{
    filepath: string;
}