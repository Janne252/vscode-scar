import {CompletionItemKind} from 'vscode';
import LuaFunctionCompletionItem from './completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from './completionItem/luaEnumCompletionItem';
import SCAREnumCompletionItem from './completionItem/scarEnumCompletionItem';

import {StaticCompletionItemSourceBase} from './completionItemSource/staticCompletionItemSourceBase';
import {ActiveCompletionItemSourceBase} from './completionItemSource/activeCompletionItemSourceBase';
import {ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource, ICompletionItemSourceMerger} from './completionItemSource/completionItemSource';
import {DocCompletionItemSourceBase} from './completionItemSource/docCompletionItemSourceBase';
import LuaDocCompletionItemSource from './completionItemSource/luaDocCompletionItemSource';
import SCARDocCompletionItemSource from './completionItemSource/scarDocCompletionItemSource';

import CompletionItemSourceMerger from './completionItemSourceMerger/completionItemSourceMerger';

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

export {
    LuaFunctionCompletionItem, LuaEnumCompletionItem, SCAREnumCompletionItem,
    StaticCompletionItemSourceBase, ActiveCompletionItemSourceBase, 
    ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource, ICompletionItemSourceMerger,
    DocCompletionItemSourceBase, LuaDocCompletionItemSource, SCARDocCompletionItemSource,
    CompletionItemSourceMerger
}

import * as fs from 'fs';

export function DumpJSON(data: any): void
{
    fs.writeFileSync('E:/vscode-ext-dev/scar/demo_files/dump.txt', JSON.stringify(data), {encoding: 'utf-8'});
}