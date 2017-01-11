'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ILuaDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../types';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from '../completionItem/luaEnumCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

export default class LuaDocCompletionItemSource extends DocCompletionItemSourceBase<ILuaDoc>
{
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }

    protected processData(data: string)
    {
        super.processData(data);

         let func: ILuaFunctionDefinition;
        for(let i = 0; i < this.data.functions.length; i++)
        {
            func = this.data.functions[i];

            this.completionItems.push(new LuaFunctionCompletionItem(func));
        }

        let luaEnum: ILuaEnumDefinition;
        for(let i = 0; i < this.data.enums.length; i++)
        {
            luaEnum = this.data.enums[i];

            this.completionItems.push(new LuaEnumCompletionItem(luaEnum));
        }
    }
}