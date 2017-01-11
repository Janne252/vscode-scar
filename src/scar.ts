import {CompletionItemKind} from 'vscode';
import CompletionItemBase from './completionItem/completionItemBase';
import LuaFunctionCompletionItem from './completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from './completionItem/luaEnumCompletionItem';
import SCAREnumCompletionItem from './completionItem/scarEnumCompletionItem';

import {CompletionItemSourceBase} from './completionItemSource/completionItemSourceBase';
import ActiveCompletionItemSource from './completionItemSource/activeCompletionItemSource';
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

export {
    CompletionItemBase, LuaFunctionCompletionItem, LuaEnumCompletionItem, SCAREnumCompletionItem,
    CompletionItemSourceBase, ActiveCompletionItemSource, 
    ICompletionItemSource, IStaticCompletionItemSource, IActiveCompletionItemSource, ICompletionItemSourceMerger,
    DocCompletionItemSourceBase, LuaDocCompletionItemSource, SCARDocCompletionItemSource,
    CompletionItemSourceMerger
}
