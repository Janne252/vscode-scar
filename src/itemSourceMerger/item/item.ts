'use strict';

import {IItem} from '../itemSourceMerger';

export default class Item implements IItem
{
    protected _id: string;
    public get id(): string
    {
        return this._id;
    }

    constructor(id: string)
    {
        this._id = id;
    }
}