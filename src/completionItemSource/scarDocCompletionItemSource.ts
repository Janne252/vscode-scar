'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ISCARDoc, ILuaFunctionDefinition, ISCAREnumDefinition} from '../scar';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import SCAREnumCompletionItem from '../completionItem/scarEnumCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

export default class ScarDocCompletionItemSource extends DocCompletionItemSourceBase<ISCARDoc>
{
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }

    protected processData(data: string)
    {
        super.processData(data);

        let func: ILuaFunctionDefinition;
        for(let i = 0; i < this._data.functions.length; i++)
        {
            func = this._data.functions[i];
            this.completionItems.push(new LuaFunctionCompletionItem(func));
        }        
        
        let scarEnum: ISCAREnumDefinition;
        for(let i = 0; i < this._data.enums.length; i++)
        {
            scarEnum = this._data.enums[i];
            this.completionItems.push(new SCAREnumCompletionItem(scarEnum));
        }
    }
}