'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ILuaDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../scar';
import SCARBlueprintCompletionItem from '../completionItem/scarBlueprintCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

export default class LuaConstsAutoCompletionItemSource extends DocCompletionItemSourceBase<string>
{
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }

    protected processData(data: string)
    {
        this.data = data;
        let lines: string[] = data.split(/\r?\n/g);
        let line: string;

        for(let i = 0; i < lines.length; i++)
        {
            line = lines[i];

            if (line.startsWith('--? ') && line.indexOf('@enum') == -1)
            {
                let entry = line.substring(4);
                
                this.completionItems.push(new SCARBlueprintCompletionItem(entry));
            }
        }
    }
}