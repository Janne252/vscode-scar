'use strict';

import {CompletionItemKind} from 'vscode';

export interface ILuaDoc
{
    functions: ILuaFunctionDefinition[];
    enums: ILuaEnumDefinition[];
}

export interface ISCARDoc
{
    functions: ILuaFunctionDefinition[];
}

export interface ILuaFunctionDefinition
{
    name: string;
    signature: string;
    returnType: string;
    parameters: ILuaFunctionDefinitionParameter[];
    description: string;
}

export interface ILuaFunctionDefinitionParameter
{
    name: string;
    optional: boolean;
    type: string;
}

export interface ILuaEnumDefinition
{
    name: string;
    description: string;
    kind: CompletionItemKind;
}
