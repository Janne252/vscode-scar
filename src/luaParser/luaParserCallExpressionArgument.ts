import {ILuaParseCallExpressionArgument, ILuaParseNodeLocation, ILuaParseNodeRange} from 'luaparse';

export default class LuaParserCallExpressionArgument implements ILuaParseCallExpressionArgument
{
    type: string;
    name: string;
    loc: ILuaParseNodeLocation;
    range: ILuaParseNodeRange;

    constructor(data: ILuaParseCallExpressionArgument)
    {
        this.type = data.type;
        this.name = data.name;
        this.loc = data.loc;
        this.range = data.range;
    }
}