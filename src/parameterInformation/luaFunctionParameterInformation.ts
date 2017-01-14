'use strict';

import {ParameterInformation} from 'vscode';
import {ILuaFunctionDefinitionParameter} from '../scar';

export default class LuaFunctionParameterInformation extends ParameterInformation
{
    constructor(parameter: ILuaFunctionDefinitionParameter)
    {
        let providedDescription = parameter.description !== undefined && parameter.description.length > 0 ? parameter.description + ' ' : '';
        super(parameter.name, `${providedDescription}type: ${parameter.type}, optional: ${parameter.optional}`);
    }
}