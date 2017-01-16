'use strict';

import {IItem, IStaticItemSource} from './types';

/**
 * Represents a static source of items.
 * @param ItemType The type of the items stored by the source.
 */
export default class StaticItemSource<ItemType extends IItem> implements IStaticItemSource<ItemType>
{
    /**
     * Current items.
     */
    protected items: ItemType[];
    /**
     * The unique indentifier of the source.
     */
    protected _id: string;
    /**
     * The unique indentifier of the source.
     */
    public get id(): string
    {
        return this._id;
    }
    /**
     * Creates a new instance of StaticItemSource.
     * @param id The unique identifier of the source.
     * @param items The items to add to the source.
     */
    constructor(id: string, items: ItemType[])
    {
        this._id = id;
        this.items = items;
    }
    /**
     * Returns all the items.
     */
    public getAllItems(): ItemType[]
    {
        return this.items;
    }

}