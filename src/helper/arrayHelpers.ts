'use strict';

export default class ArrayHelpers
{
    private constructor()
    {

    }

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