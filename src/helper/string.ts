'use strict';

export default class StringHelpers
{
    protected constructor()
    {

    }

    public static containsAny(str: string, find: string[]): boolean
    {
        for(let i = 0; i < find.length; i++)
        {
            if (str.indexOf(find[i]) !== -1)
            {
                return true;
            }
        }

        return false;
    }
}