'use strict';

import {IItem, IStaticItemSource} from '../itemSourceMerger';

export default class StaticItemSource<ItemType extends IItem> implements IStaticItemSource<ItemType>
{
    protected items: ItemType[];

    protected _id: string;
    public get id(): string
    {
        return this._id;
    }

    protected _isReady: boolean;
    public get isReady():boolean
    {
        return this._isReady;
    }

    constructor(id: string, items: ItemType[])
    {
        this._id = id;
        this.items = items;
        this._isReady = false;
    }

    public getAllItems(): ItemType[]
    {
        return this.items;
    }

}