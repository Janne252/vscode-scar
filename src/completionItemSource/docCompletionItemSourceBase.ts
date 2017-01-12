'use strict';

import {CompletionList} from 'vscode';
import {StaticCompletionItemSourceBase} from './staticCompletionItemSourceBase';
import * as fs from 'fs';
import * as path from 'path';

import {ISCARDoc, ILuaFunctionDefinition, ILuaEnumDefinition} from '../scar';
import {IStaticCompletionItemSource} from './completionItemSource';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import LuaEnumCompletionItem from '../completionItem/luaEnumCompletionItem';

/**
 * Represents abstract CompletionItemProviderSource for sources that rely on reading contents of a file.
 */
export abstract class DocCompletionItemSourceBase<T> extends StaticCompletionItemSourceBase implements IStaticCompletionItemSource
{
    /**
     * The data that was read from the file.
     */
    protected _data: T = undefined;
    /**
     * The raw data of the source.
     */
    public get data(): T
    {
        return this._data;
    }
    /**
     * The absolute file path of the source data file.
     */
    protected _filepath : string;
    /**
     * The absolute file path of the source data file.
     */
    public get filepath() : string 
    {
        return this._filepath;
    }
    /**
     * Encoding used to read the data file.
     */
    protected _encoding : string;
    /**
     * Encoding used to read the data file.
     */
    public get encoding() : string 
    {
        return this._encoding;
    }
    /**
     * Creates a new instance of DocCompletionItemSourceBase.
     * @param filepath The absolute file path to the data file.
     * @param encoding The encoding used to read the file. Default: "uft-8"
     */
    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super();

        this._filepath = filepath;
        this._encoding = encoding;
    }
    /**
     * Processes the data.
     */
    protected processData(data: string)
    {
        this._data = JSON.parse(data);
    }
    /**
     * Initializes the source by loading and processing the data.
     */
    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            if (this._isReady)
            {
                resolve();
            }
            else
            {
                fs.readFile(this.filepath, this.encoding, (err, data) =>
                {
                    if (err)
                    {
                        reject(err);
                    }

                    this.processData(data);
                    this._isReady = true;
                    resolve();
                });
            }
        });
    }
}