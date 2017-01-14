'use strict';

import {ParameterInformation} from 'vscode';
import {ILuaFunctionDefinitionParameter} from '../scar';

export default class WorkspaceLuaFunctionParameterInformation extends ParameterInformation
{
    constructor(parameter: ILuaFunctionDefinitionParameter)
    {
        super(parameter.name, parameter.description);
    }
}