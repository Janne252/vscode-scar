'use strict';

import ArrayHelpers from '../helper/arrayHelpers';

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
    protected removeItems(items: ItemType[]): void
    {
        for(let item of items)
        {
            delete this.itemsDictionary[item.id];
        }

        ArrayHelpers.removeMany(this.items, items);
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

/**
 * Available source types.
 */
export enum ItemSourceType
{
    /**
     * Static source. Does not change after initialization.
     */
    Static,
    /**
     * Active source. May change after initialization.
     */
    Active
}

/**
 * Base interface for all items processed by ItemSources.
 */
export interface IItem
{
    id: string;
}

/**
 * Base interface for all ItemSources.
 * @param ItemType the type of the item this source holds.
 */
export interface IItemSource<ItemType extends IItem>
{
    /**
     * The unique indentifier of the source.
     */
    id: string;
    /**
     * Returs all the items of the source.
     */
    getAllItems(): ItemType[];
}

/**
 * Base interface for static sources.
 * @param ItemType the type of the item this source holds.
 */
export interface IStaticItemSource<ItemType extends IItem> extends IItemSource<ItemType>
{
    
}

/**
 * Base interface for active sources.
 * @param ItemType the type of the item this source holds.
 */
export interface IActiveItemSource<ItemType extends IItem> extends IStaticItemSource<ItemType>
{
    /**
     * Returns the previous items (before last update).
     */
    getPreviousItems(): ItemType[];
    /**
     * Replaces the items with a set of new ones.
     * @param items The items to replce the old items.
     */
    updateItems(items: ItemType[]): void;
    /**
     * The merger that is notified of changes in the source.
     */
    merger: IItemSourceMerger<ItemType>;
    /**
     * Adds an item to the source.
     * @param item The item to add.
     */
    addItem(item: ItemType): void;
    /**
     * Removes an item from the source.
     * @param item The item to remove.
     */
    removeItem(item: ItemType): void;
    /**
     * Removes items from the source based on a comparer (arrow function).
     * @param comparer The comparer used to select the items to remove.
     */
    removeItems(comparer: IItemComparer<ItemType>): void;
    /**
     * Removes all items from the source.
     */
    clear(): void;
}

/**
 * Base interface for ItemSourceMerger.
 * @param ItemType The type of an item this merger handles.
 */
export interface IItemSourceMerger<ItemType extends IItem>
{
    /**
     * Adds a static source to the merger.
     * @param source The source to add.
     */
    addStaticSource(source: IStaticItemSource<ItemType>): void;
    /**
     * Removes a static source from the merger.
     * @param source The source to remove.
     */
    removeStaticSource(source: IStaticItemSource<ItemType>): void;
    /**
     * Adds an active source to the merger.
     * @param source The source to add.
     */
    addActiveSource(source: IActiveItemSource<ItemType>): void;
    /**
     * Removes an active source from the merger.
     * @param source The source to remove.
     */
    removeActiveSource(source: IActiveItemSource<ItemType>): void;
    /**
     *  Reloads items from the source.
     * @param souce The source to reload the items from.
     */
    activeSourceUpdated(source: IActiveItemSource<ItemType>): void;
    /**
     * Returns all the items held by the merger.
     */
    getAllItems(): ItemType[];
    /**
     * Returns the items matching the comparer.
     * @param comparer The comparer (arrow function) used to select the item.
     */
    getItems(comparer: IItemComparer<ItemType>): ItemType[];
    /**
     * Returns the first item matching the comparer.
     * @param comparer The comparer (arrow function) used to select the item.
     */
    getItem(comparer: IItemComparer<ItemType>): ItemType;
}

/**
 * Arrow function uised to filter source items.
 * @param ItemType The type of the items to filter.
 */
export interface IItemComparer<ItemType extends IItem>
{
    /**
     * @param item The current item to check.
     */
    (item: ItemType): boolean;
}
