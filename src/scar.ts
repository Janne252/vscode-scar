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
    enums: ISCAREnumDefinition[];
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
    description?: string;
}

export interface ILuaEnumDefinition
{
    name: string;
    description: string;
    kind: CompletionItemKind;
}

export interface ISCAREnumDefinition
{
    name: string;
    type: string;
}

export interface ILoadableSource<T>
{
    load(): Thenable<T>;
}

import * as fs from 'fs';

export function DumpJSON(data: any): void
{
    fs.writeFileSync('E:/vscode-ext-dev/scar/demo_files/dump.txt', JSON.stringify(data), {encoding: 'utf-8'});
}