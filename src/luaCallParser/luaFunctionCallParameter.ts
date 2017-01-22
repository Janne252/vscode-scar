'use strict';

/**
 * Data holder for LuaFunctionCall parameter start nad end index.
 */
export default class LuaFunctionCallParameter
{
    public startIndex:number;
    public endIndex:number;
    
    constructor(startIndex:number, endIndex:number)
    {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
}