'use strict';

import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import * as fs from 'fs';

export default class SourceFileItemSource<ItemType extends IItem> extends ActiveItemSource<ItemType>
{
    protected filepath: string;
    protected encoding: string;


    constructor(id: string, filepath: string, encoding: string = 'utf-8')
    {
        super(id, []);
    }

    protected processData(data: any): void
    {

    }

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