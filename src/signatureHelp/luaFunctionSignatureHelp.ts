'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';
import {ILuaFunctionDefinition} from '../scar';
import LuaFunctionSignatureInformation from '../signatureInformation/luaFunctionSignatureInformation';
import NamedSignatureHelp from './namedSignatureHelp';
import LuaFunctionParameterInformation from '../parameterInformation/luaFunctionParameterInformation';

export default class LuaFunctionSignatureHelp extends NamedSignatureHelp
{
    public luaFunction: ILuaFunctionDefinition;

    constructor(luaFunction: ILuaFunctionDefinition)
    {
        super(luaFunction.name);

        this.luaFunction = luaFunction;

        this.activeParameter = 0;
        this.activeSignature = 0;

        this.signatures = [
            new LuaFunctionSignatureInformation(luaFunction)
        ]
    }
}