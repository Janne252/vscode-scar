'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ILuaDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../scar';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from '../completionItem/luaEnumCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

/**
 * Represents Lua standard libary functions and constants CompletionItem source.
 */
export default class LuaDocCompletionItemSource extends DocCompletionItemSourceBase<ILuaDoc>
{
    /**
     * Creates a new instance of LuaDocCompletionItemSource.
     * @param filepath The file path to the file containing LuaDoc.
     * @param encoding The encoding used to read the file. Default: 'utf-8'
     */
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }
    /**
     * Processes the data.
     * @param data The data to process.
     */
    protected processData(data: string)
    {
        super.processData(data);

         let func: ILuaFunctionDefinition;
        for(let i = 0; i < this._data.functions.length; i++)
        {
            func = this._data.functions[i];

            this.completionItems.push(new LuaFunctionCompletionItem(func));
        }

        let luaEnum: ILuaEnumDefinition;
        for(let i = 0; i < this._data.enums.length; i++)
        {
            luaEnum = this._data.enums[i];

            this.completionItems.push(new LuaEnumCompletionItem(luaEnum));
        }
    }
}