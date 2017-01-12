'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ILuaDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../scar';
import SCARBlueprintCompletionItem from '../completionItem/scarBlueprintCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

export default class LuaConstsAutoCompletionItemSource extends DocCompletionItemSourceBase<string>
{
    private combinedList: string;
    private rawList: string[];
    private _matchAllRegexString: string;
    public get matchAllRegexString(): string
    {
        return this._matchAllRegexString;
    }

    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
        this.rawList = [];
    }

    protected processData(data: string)
    {
        this._data = data;
        let lines: string[] = data.split(/\r?\n/g);
        let line: string;

        for(let i = 0; i < lines.length; i++)
        {
            line = lines[i];
            
            if (line.startsWith('--? ') && line.indexOf('@enum') == -1)
            {
                let entry = line.substring(4);

                this.rawList.push(entry);
                this.completionItems.push(new SCARBlueprintCompletionItem(entry));
            }
        }

        this.combinedList = this.rawList.join('|');
        this._matchAllRegexString = `\\b(${this.combinedList})\\b`;
    }

    public getMatchAllRegExp(): RegExp
    {
        return new RegExp(this._matchAllRegexString, 'g');
    }
}