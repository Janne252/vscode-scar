'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ILuaDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../scar';
import SCARBlueprintCompletionItem from '../completionItem/scarBlueprintCompletionItem';
import {DocCompletionItemSourceBase} from './docCompletionItemSourceBase';

/**
 * Represents LuaConstsAuto.scar completionItem source.
 */
export default class LuaConstsAutoCompletionItemSource extends DocCompletionItemSourceBase<string>
{
    /**
     * All blueprints combined to one string, separated by '|'.
     */
    private combinedList: string;
    /**
     * Raw list of all the blueprints.
     */
    private rawList: string[];
    /**
     * Regex pattern that can be used to match blueprint occurrances in a document.
     */
    private _matchAllRegexString: string;
    /**
     * Regex pattern that can be used to match blueprint occurrances in a document.
     */
    public get matchAllRegexString(): string
    {
        return this._matchAllRegexString;
    }
    /**
     * Creates a new instance of LuaConstsAutoCompletionItemSource.
     * @param filepath The file path to the LuaConstsAuto.scar file.
     * @param encoding The encoding used to read the file. Default: 'utf-8'
     */
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
        this.rawList = [];
    }
    /**
     * Processes the data.
     * @param data The data to process.
     */
    protected processData(data: string): void
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
    /**
     * Retruns the RegExp that can be used to find all blueprint occurrances in a document.
     */
    public getMatchAllRegExp(): RegExp
    {
        return new RegExp(this._matchAllRegexString, 'g');
    }
    /**
     * Returns the raw list of all blueprints.
     */
    public getRawList(): string[]
    {
        return this.rawList;
    }
}