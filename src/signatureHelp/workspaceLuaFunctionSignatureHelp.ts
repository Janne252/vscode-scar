'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';
import {ILuaFunctionDefinition, ILuaFunctionDefinitionParameter} from '../scar';
import LuaFunctionSignatureInformation from '../signatureInformation/luaFunctionSignatureInformation';
import NamedSignatureHelp from './namedSignatureHelp';
import LuaFunctionParameterInformation from '../parameterInformation/luaFunctionParameterInformation';
import WorkspaceLuaFunctionSignatureInformation from '../signatureInformation/workspaceLuaFunctionSignatureInformation';

export default class WorkspaceLuaFunctionSignatureHelp extends NamedSignatureHelp
{
    constructor(name: string, signature: string, descrption: string, parameters: ILuaFunctionDefinitionParameter[])
    {
        super(name);

        this.activeParameter = 0;
        this.activeSignature = 0;

        this.signatures = [
            new WorkspaceLuaFunctionSignatureInformation(signature, descrption, parameters)
        ];
    }
}