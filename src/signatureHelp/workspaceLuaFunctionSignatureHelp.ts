'use strict';

import {SignatureHelp, SignatureInformation} from 'vscode';
import {ILuaFunctionDefinition, ILuaFunctionDefinitionParameter} from '../scar';
import LuaFunctionSignatureInformation from '../signatureInformation/luaFunctionSignatureInformation';
import NamedSignatureHelp from './namedSignatureHelp';
import LuaFunctionParameterInformation from '../parameterInformation/luaFunctionParameterInformation';
import WorkspaceLuaFunctionSignatureInformation from '../signatureInformation/workspaceLuaFunctionSignatureInformation';

/**
 * Represents SignatureHelp for workspace user-defined functions.
 */
export default class WorkspaceLuaFunctionSignatureHelp extends NamedSignatureHelp
{
    /**
     * The source file this SignatureHelp originates from.
     */
    public source: string;
    /**
     * Creates a new instace of WorkspaceLuaFunctionSignatureHelp.
     * @param name The name of the function.
     * @param signature The signature of the function.
     * @param descrption The description of the function.
     * @param parameter The parameters of the function. 
     * @param source The source file of the function.
     */
    constructor(name: string, signature: string, descrption: string, parameters: ILuaFunctionDefinitionParameter[], source: string)
    {
        super(name);

        this.source = source;
        this.activeParameter = 0;
        this.activeSignature = 0;

        this.signatures = [
            new WorkspaceLuaFunctionSignatureInformation(signature, descrption, parameters)
        ];
    }
}