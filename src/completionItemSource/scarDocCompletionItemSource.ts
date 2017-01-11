'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ISCARDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../types';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

export default class LuaDocCompletionItemSource extends DocCompletionItemSourceBase<ISCARDoc>
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
    }
}