'use strict';

import {IItem, IItemSourceMerger, IStaticItemSource, IActiveItemSource, IItemSource, ItemSourceType, IItemComparer} from './types';
/**
 * Represents a merger of items from various kinds of sources.
 * @param ItemType Type of the item this source merger provides.
 */
export default class ItemSourceMerger<ItemType extends IItem> implements IItemSourceMerger<ItemType>
{
    /**
     * Current items.
     */
    protected items: ItemType[];
    /**
     * Object used for quickly checking if an item already exists.
     */
    protected itemsDictionary: {[id: string]: IItem};
    /**
     * Static sources.
     */
    protected staticSources: {[id: string]: IStaticItemSource<ItemType>};
    /**
     * Actie sources.
     */
    protected activeSources: {[id: string]: IActiveItemSource<ItemType>};
    /**
     * Creates a new instance of ItemSourceMerger.
     */
    constructor()
    {
        this.items = [];
        this.itemsDictionary = {};
        this.staticSources = {};
        this.activeSources = {};
    }
    /**
     * Internally adds a new item to the collections.
     */
    protected addNewItem(item: ItemType): void
    {
        this.itemsDictionary[item.id] = item;
        this.items.push(item);
    }
    /**
     * Internally updates an existing item.
     */
    protected updateExistingItem(item: ItemType): void
    {
        this.itemsDictionary[item.id] = item;

        for(let i = 0; i < this.items.length; i++)
        {
            if (this.items[i].id == item.id)
            {
                this.items[i] = item;
                break;
            }
        }
    }
    /**
     * Internally adds an array of items to the collections.
     */
    protected addItems(items: ItemType[]): void
    {
        for(let item of items)
        {
            if (this.itemExists(item.id))
            {
                this.updateExistingItem(item);
            }
            else
            {   
                this.addNewItem(item);
            }
        }
    }
    /**
     * Internally removes items from the collections.
     */
    protected removeItems(itemsToRemove: ItemType[]): void
    {
        for(let item of itemsToRemove)
        {
            delete this.itemsDictionary[item.id];
        }

        for(let i = this.items.length - 1; i >= 0; i--)
        {
            for(let j = itemsToRemove.length; j < itemsToRemove.length; j++)
            {
                if (this.items[i] == itemsToRemove[j])
                {
                    this.items.splice(i, 1);
                }
            }
        }
    }
    /**
     * Checks if an item already exists.
     */
    public itemExists(itemId: string): boolean
    {
        return this.itemsDictionary[itemId] !== undefined;
    }
    /**
     * Internally adds a source.
     * @param source The source to add.
     * @param type The type of the source (Static or Active).
     */
    protected addSourceInternal(source: IItemSource<ItemType>, type: ItemSourceType): void
    {
        let existing: IItemSource<ItemType>;

        if (type == ItemSourceType.Static)
        {
            existing = this.staticSources[source.id];
        }
        else
        {
            existing = this.activeSources[source.id];
        }   
        if (existing !== undefined)
        {
            if (type == ItemSourceType.Static)
            {
                this.removeStaticSource(<IStaticItemSource<ItemType>>source);   
            }
            else
            {
                this.removeActiveSource(<IActiveItemSource<ItemType>>source);
            }   
        }

        this.addItems(source.getAllItems());

        if (type == ItemSourceType.Static)
        {
            this.staticSources[source.id] = <IStaticItemSource<ItemType>>source;
        }
        else
        {
            this.activeSources[source.id] = <IActiveItemSource<ItemType>>source;
        }   
    }
    /**
     * Adds a static source to the merger.
     * @param source The source to add.
     */
    public addStaticSource(source: IStaticItemSource<ItemType>): void
    {
        this.addSourceInternal(source, ItemSourceType.Static);
    }
    /**
     * Removes a static source from the merger.
     * @param source The source to remove.
     */
    public removeStaticSource(source: IStaticItemSource<ItemType>): void
    {
        this.removeItems(source.getAllItems());

        delete this.staticSources[source.id];
    }
    /**
     * Adds an active source to the merger.
     * @param source The source to add.
     */
    public addActiveSource(source: IActiveItemSource<ItemType>): void
    {
        this.addSourceInternal(source, ItemSourceType.Active);
        source.merger = this;
    }
    /**
     * Removes an active source from the merger.
     * @param source The source to remove.
     */
    public removeActiveSource(source :IActiveItemSource<ItemType>): void
    {
        this.removeItems(source.getAllItems());
        delete this.activeSources[source.id];
        source.merger = undefined;
    }
    /**
     *  Reloads items from the source.
     * @param souce The source to reload the items from.
     */
    public activeSourceUpdated(source: IActiveItemSource<ItemType>): void
    {
        this.removeItems(source.getPreviousItems());
        this.addItems(source.getAllItems());
    }
    /**
     * Returns all the items.
     */
    public getAllItems(): ItemType[]
    {
        return this.items;
    }
    /**
     * Returns the first item matching the comparer.
     * @param comparer The comparer (arrow function) used to select the item.
     */
    public getItem(comparer: IItemComparer<ItemType>): ItemType
    {
        for(let item of this.items)
        {
            if (comparer(item))
            {
                return item;
            }
        }

        return undefined;
    }
    /**
     * Returns the items matching the comparer.
     * @param comparer The comparer (arrow function) used to select the item.
     */
    public getItems(comparer: IItemComparer<ItemType>): ItemType[]
    {
        let result: ItemType[] = [];

        for(let item of this.items)
        {
            if (comparer(item))
            {
                result.push(item);
            }
        }

        return result;
    }
}