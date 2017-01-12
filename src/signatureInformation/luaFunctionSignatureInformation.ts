'use strict';

import {ParameterInformation} from 'vscode';
import SignatureInformationBase from './signatureInformationBase';
import {ILuaFunctionDefinition} from '../scar';
import LuaFunctionParameterInformation from '../parameterInformation/luaFunctionParameterInformation';

export default class LuaFunctionSignatureInformation extends SignatureInformationBase
{
    constructor(luaFunction: ILuaFunctionDefinition)
    {
        let signature = '';
        let paramNames = [];
        if (luaFunction.signature === undefined)
        {
            for(let param of luaFunction.parameters)
            {
                paramNames.push(param.name);
            }

            signature = `${luaFunction.name}(${paramNames.join(', ')})`;
        }
        else
        {
            signature = luaFunction.signature;
        }

        super(signature, luaFunction.description);

        this.parameters = [];

        for(let parameter of luaFunction.parameters)
        {
            this.parameters.push(new LuaFunctionParameterInformation(parameter));
        }
    }
}