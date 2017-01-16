'use strict';

import {IItem} from '../itemSourceMerger';

export default class Item implements IItem
{
    protected _id: string;
    public get id(): string
    {
        return this._id;
    }

    protected _name: string;
    public get name(): string
    {
        return this._name;
    }

    constructor(id: string, name: string = undefined)
    {
        this._id = id;
        this._name = name !== undefined ? name : id;
    }
}