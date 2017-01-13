'use strict';

/**
 * Represents a collection of array helper functions.
 */
export default class ArrayHelpers
{
    /**
     * Removes an item from an array.
     * @param source The array to remove the item from.
     * @param item The item to remove.
     */
    public static remove(source: any[], item: any): void
    {
        for(let i = source.length - 1; i >= 0; i--)
        {
            if (source[i] == item)
            {
                source.splice(i, 1);
            }
        }
    }
    /**
     * Removes an array of items from an array.
     * @param source The array to remove the item from.
     * @param items The array of items to remove.
     */
    public static removeMany(source: any[], items: any[]): void
    {
        if (items.length == 0)
        {
            return;
        }

        for(let i = source.length - 1; i >= 0; i--)
        {
            for(let j = 0; j < items.length; j++)
            {
                if (source[i] == items[j])
                {
                    source.splice(i, 1);
                }
            }
        }
    }
}