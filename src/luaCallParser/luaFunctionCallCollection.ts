'use strict';

import LuaFunctionCall from './luaFunctionCall';
import LuaFunctionCallParameter from './luaFunctionCallParameter';

/**
 * Handles LuaFunctionCall items and their opening, closing, and parameter index counting.
 */
export default class LuaFunctionCallCollection
{
    public items:LuaFunctionCall[] = [];
    public openCount:number = 0;
    
    public clear():void
    {
        this.items = [];
        this.openCount = 0;
    }
    
    public open(name:string, startIndex:number):LuaFunctionCall
    {
        var call:LuaFunctionCall = new LuaFunctionCall(name, startIndex);
        
        this.items.push(call);
        this.openCount++;
        
        return call;
    }
    
    public close(endIndex:number):void
    {
        var existingCall:LuaFunctionCall = this.findOpen();
        if (existingCall != null && existingCall.isOpen)
        {
            this.closeParameter(endIndex);
            existingCall.isOpen = false;
            existingCall.endIndex = endIndex;
            this.openCount--;
        }
    }
    
    public closeParameter(endIndex:number)
    {
        var existingCall:LuaFunctionCall = this.findOpen();
            
        if (existingCall != null && existingCall.isOpen)
        {
            var startIndex:number;
            var paramCount = existingCall.getParameterCount();
            if (paramCount > 0)
            {
                startIndex = existingCall.parameters[paramCount - 1].endIndex + 1;
            }
            else
            {
                startIndex = existingCall.startIndex + existingCall.name.length + 1;
            }
            
            existingCall.parameters.push(new LuaFunctionCallParameter(startIndex, endIndex));
        }
    }
    
    public findOpen():LuaFunctionCall
    {
        var existingCall:LuaFunctionCall;
        
        for (var i = this.items.length - 1; i >= 0; i--)
        {
            existingCall = this.items[i];
            
            if (existingCall.isOpen)
            {
                return existingCall;
            }
        }
        
        return null;
    }
}