'use strict';

/**
 * Represents a collection of string helper functions.
 */
export default class StringHelpers
{
    /**
     * Checks if a string contains any of the substrings from the provided array. 
     * Returns true if at least one of the items occur in the string. Returns false if none of the items are found in the string.
     * @param str The string to check.
     * @param items The items to check if they occur in the string.
     */
    public static containsAny(str: string, items: string[]): boolean
    {
        for(let i = 0; i < items.length; i++)
        {
            if (str.indexOf(items[i]) !== -1)
            {
                return true;
            }
        }

        return false;
    }
}