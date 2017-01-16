'use strict';

import {IItem} from '../itemSourceMerger/types';
import StaticItemSource from './staticSource';
import * as fs from 'fs';

/**
 * Represents a static source that loads data from a file.
 * @param ItemType the type of the item the source stores.
 */
export abstract class FileSourceBase<ItemType extends IItem> extends StaticItemSource<ItemType>
{
    /**
     * The path of the file the data is read from.
     */
    protected filepath: string;
    /**
     * The encoding used to read the file.
     */
    protected encoding: string;
    /**
     * Whether or not the sourc has finished loading.
     */
    protected _isReady: boolean;
    /**
     * Whether or not the sourc has finished loading.
     */
    public get isReady():boolean
    {
        return this._isReady;
    }
    /**
     * Creates a new instance of SourceFileItemSource.
     * @param id The unique idenfier of the source.
     * @param filepath The path to the file.
     * @param encoding The encoding used to read the file.
     */
    constructor(id: string, filepath: string, encoding: string = 'utf-8')
    {
        super(id, []);

        this._isReady = false;
    }
    /**
     * Internally processes the data.
     * @param data The data that was read from the file.
     */
    protected processData(data: any): void
    {

    }   
    /**
     * Reads the file and processes it. Returns a promise.
     */
    public load(): Thenable<void>
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
                this._isReady = true;
                resolve();
            });
        });
    }
}