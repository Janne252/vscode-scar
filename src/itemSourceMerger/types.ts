'use strict';

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
    readonly id: string;
    readonly name: string;
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
    readonly id: string;
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
     * Adds a collection of items to the existing pool if items.
     * @param itemsToAdd The items to add.
     */
    addItems(itemsToAdd: ItemType[]): void;
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
