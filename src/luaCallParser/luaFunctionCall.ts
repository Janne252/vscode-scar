'use strict';
 
import LuaFunctionCallParameter from './luaFunctionCallParameter';
import LuaBracketCounter from './luaBracketCounter';

/**
 * Holds necessary details of a lua function call.
 */
export default class LuaFunctionCall
{
    public name:string;
    public startIndex:number;
    public endIndex:number;
    public parameters:LuaFunctionCallParameter[] = [];
    public isOpen:boolean = true;
    
    public luaBracketCounter:LuaBracketCounter = new LuaBracketCounter();
    
    constructor(name:string, startIndex:number)
    {
        this.name = name;
        this.startIndex = startIndex;
    }
    
    public getParameterCount():number
    {
        return this.parameters.length;
    }
}