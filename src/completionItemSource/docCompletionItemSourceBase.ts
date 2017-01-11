'use strict';

import {CompletionList} from 'vscode';
import {CompletionItemSourceBase} from './completionItemSourceBase';
import * as fs from 'fs';
import * as path from 'path';

import {ISCARDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../types';
import {IStaticCompletionItemSource} from './completionItemSource';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from '../completionItem/luaEnumCompletionItem';

export abstract class DocCompletionItemSourceBase<T> extends CompletionItemSourceBase implements IStaticCompletionItemSource
{
    protected data: T = undefined;
    protected _filepath : string;
    public get filepath() : string 
    {
        return this._filepath;
    }

    protected _encoding : string;
    public get encoding() : string 
    {
        return this._encoding;
    }

    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super();

        this._filepath = filepath;
        this._encoding = encoding;
    }

    protected processData(data: string)
    {
        this.data = JSON.parse(data);
    }

    public init(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            fs.readFile(this.filepath, this.encoding, (err, data) =>
            {
                if (err)
                {
                    reject(err);
                }

                this.processData(data);
                resolve();
            });
        });
    }
}