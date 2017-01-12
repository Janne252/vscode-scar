'use strict';

import {ParameterInformation} from 'vscode';
import SignatureInformationBase from './signatureInformationBase';
import {ILuaFunctionDefinition} from '../scar';

export default class LuaFunctionSignatureInformation extends SignatureInformationBase
{
    constructor(luaFunction: ILuaFunctionDefinition)
    {
        super(luaFunction.signature, luaFunction.description);

        this.parameters = [];

        for(let parameter of luaFunction.parameters)
        {
            this.parameters.push(new ParameterInformation(parameter.name, `type: ${parameter.type}, optional: ${parameter.optional}`));
        }
    }
}