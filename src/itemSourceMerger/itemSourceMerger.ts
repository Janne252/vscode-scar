'use strict';

import ArrayHelpers from '../helper/arrayHelpers';

export default class ItemSourceMerger<ItemType extends IItem> implements IItemSourceMerger<ItemType>
{
    protected items: ItemType[];
    protected itemsDictionary: {[id: string]: IItem};

    protected staticSources: {[id: string]: IStaticItemSource<ItemType>};
    protected activeSources: {[id: string]: IActiveItemSource<ItemType>};

    constructor()
    {
        this.items = [];
        this.itemsDictionary = {};
        this.staticSources = {};
        this.activeSources = {};
    }

    protected addNewItem(item: ItemType): void
    {
        this.itemsDictionary[item.id] = item;
        this.items.push(item);
    }
    
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

    protected removeItems(items: ItemType[]): void
    {
        for(let item of items)
        {
            delete this.itemsDictionary[item.id];
        }

        ArrayHelpers.removeMany(this.items, items);
    }

    public itemExists(itemId: string): boolean
    {
        return this.itemsDictionary[itemId] !== undefined;
    }

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

    public addStaticSource(source: IStaticItemSource<ItemType>): void
    {
        this.addSourceInternal(source, ItemSourceType.Static);
    }

    public removeStaticSource(source: IStaticItemSource<ItemType>): void
    {
        this.removeItems(source.getAllItems());

        delete this.staticSources[source.id];
    }

    public addActiveSource(source: IActiveItemSource<ItemType>): void
    {
        this.addSourceInternal(source, ItemSourceType.Active);
        source.merger = this;
    }

    public removeActiveSource(source :IActiveItemSource<ItemType>): void
    {
        this.removeItems(source.getAllItems());
        delete this.activeSources[source.id];
        source.merger = undefined;
    }

    public activeSourceUpdated(source: IActiveItemSource<ItemType>): void
    {
        this.removeItems(source.getPreviousItems());
        this.addItems(source.getAllItems());
    }

    public getAllItems(): ItemType[]
    {
        return this.items;
    }

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

export enum ItemSourceType
{
    Static,
    Active
}

export interface IItem
{
    id: string;
}

export interface IItemSource<ItemType extends IItem>
{
    id: string;
    isReady: boolean;
    getAllItems(): ItemType[];
}

export interface IStaticItemSource<ItemType extends IItem> extends IItemSource<ItemType>
{
    
}

export interface IActiveItemSource<ItemType extends IItem> extends IStaticItemSource<ItemType>
{
    getPreviousItems(): ItemType[];
    updateItems(items: ItemType[]): void;
    merger: IItemSourceMerger<ItemType>;

    addItem(item: ItemType): void;
    removeItem(item: ItemType): void;
    removeItemById(itemId: string): void;
    removeItems(comparer: IItemComparer<ItemType>): void;
    clear(): void;
}

export interface IItemSourceMerger<ItemType extends IItem>
{
    addStaticSource(source: IStaticItemSource<ItemType>): void;
    removeStaticSource(source: IStaticItemSource<ItemType>): void;
    addActiveSource(source: IActiveItemSource<ItemType>): void;
    removeActiveSource(source: IActiveItemSource<ItemType>): void;

    activeSourceUpdated(source: IActiveItemSource<ItemType>): void;

    getAllItems(): ItemType[];
    getItems(comparer: IItemComparer<ItemType>): ItemType[];
    getItem(comparer: IItemComparer<ItemType>): ItemType;
}

export interface IItemComparer<ItemType extends IItem>
{
    (item: ItemType): boolean;
}
