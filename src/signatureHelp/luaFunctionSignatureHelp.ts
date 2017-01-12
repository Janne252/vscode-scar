'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';
import {ILuaFunctionDefinition} from '../scar';
import LuaFunctionSignatureInformation from '../signatureInformation/luaFunctionSignatureInformation';

export default class LuaFunctionSignatureHelp extends SignatureHelp
{
    public luaFunction: ILuaFunctionDefinition;

    constructor(luaFunction: ILuaFunctionDefinition)
    {
        super();

        this.luaFunction = luaFunction;

        this.activeParameter = 0;
        this.activeSignature = 0;

        this.signatures = [
            new LuaFunctionSignatureInformation(luaFunction)
        ]
    }
}