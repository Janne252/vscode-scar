'use strict';

import StaticItemSource from './static';
import {IItem, IActiveItemSource, IItemSourceMerger, IItemComparer} from '../itemSourceMerger';

export default class ActiveItemSource<ItemType extends IItem> extends StaticItemSource<ItemType> implements IActiveItemSource<ItemType>
{
    protected previousItems: ItemType[];

    public merger: IItemSourceMerger<ItemType>;

    constructor(id: string, initialItems: ItemType[] = [])
    {
        super(id, initialItems);

        this.previousItems = [];
    }

    protected notifyMerger(): void
    {
        if (this.merger !== undefined)
        {
            this.merger.activeSourceUpdated(this);
        }
    }

    public getPreviousItems(): ItemType[]
    {
        return this.previousItems;
    }

    public updateItems(items: ItemType[]): void
    {

        this.previousItems = this.items;
        this.items = items;

        this.notifyMerger();
    }

    public addItem(item: ItemType): void
    {
        let existing = Array.from(this.items);

        for(let i = existing.length - 1; i >= 0; i--)
        {
            if (existing[i].id == item.id)
            {
                existing.splice(i, 1);
            }
        }

        existing.push(item);

        this.updateItems(existing);
    }

    public removeItem(item: ItemType): void
    {
        this.removeItemById(item.id);
    }

    public removeItemById(itemId: string): void
    {
        let existing = Array.from(this.items);

        for(let i = existing.length - 1; i >= 0; i--)
        {
            if (existing[i].id == itemId)
            {
                existing.splice(i, 1);
            }
        }
       
       this.updateItems(existing);
    }

    public removeItems(comparer: IItemComparer<ItemType>): void
    {
        let existing = Array.from(this.items);

        for(let i = existing.length - 1; i >= 0; i--)
        {
            if (comparer(existing[i]))
            {
                existing.splice(i, 1);
            }
        }
       
       this.updateItems(existing);
    }

    public clear(): void
    {
        this.previousItems = this.items;
        this.items = [];

        this.notifyMerger();
    }
}