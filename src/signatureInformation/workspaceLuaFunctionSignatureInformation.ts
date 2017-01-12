'use strict';

import {ParameterInformation} from 'vscode';
import SignatureInformationBase from './signatureInformationBase';
import {ILuaFunctionDefinition, ILuaFunctionDefinitionParameter} from '../scar';
import LuaFunctionParameterInformation from '../parameterInformation/luaFunctionParameterInformation';

export default class WorkspaceLuaFunctionSignatureInformation extends SignatureInformationBase
{
    constructor(signature: string, description: string, parameters: ILuaFunctionDefinitionParameter[])
    {
        super(signature, description);

        this.parameters = [];

        for(let parameter of parameters)
        {
            this.parameters.push(new LuaFunctionParameterInformation(parameter));
        }
    }
}