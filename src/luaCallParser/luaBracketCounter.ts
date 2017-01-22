'use strict';

/**
 * Utility class for keeping track of per-LuaFunctionCall bracket index.
 */
export default class LuaBracketCounter
{
    public bracket:number = 0;
    public curly:number  = 0;
    public angle:number = 0;
}