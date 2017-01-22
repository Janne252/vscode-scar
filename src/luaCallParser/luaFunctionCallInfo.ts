'use strict';

import LuaFunctionCall from './luaFunctionCall';

/**
 * Data wrapper for LuaFunctionCall and the currently active parameter index.
 */
export default class LuaFunctionCellInfo
{
    public functionCall:LuaFunctionCall;
    public parameterIndex:number;
    
    constructor(call:LuaFunctionCall, paramIndex:number) 
    {
        this.functionCall = call;
        this.parameterIndex = paramIndex;
    }
}