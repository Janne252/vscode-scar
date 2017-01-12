'use strict';

import {ParameterInformation} from 'vscode';
import {ILuaFunctionDefinitionParameter} from '../scar';

export default class LuaFunctionParameterInformation extends ParameterInformation
{
    constructor(parameter: ILuaFunctionDefinitionParameter)
    {
        super(parameter.name, `type: ${parameter.type}, optional: ${parameter.optional}`);
    }
}