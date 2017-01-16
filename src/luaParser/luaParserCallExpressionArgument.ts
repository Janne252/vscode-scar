import {ILuaParserCallExpressionArgument, ILuaParserTreeLocation, ILuaParserTreeRange} from 'luaparse';

export default class LuaParserCallExpressionArgument implements ILuaParserCallExpressionArgument
{
    type: string;
    name: string;
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;

    constructor(data: ILuaParserCallExpressionArgument)
    {
        this.type = data.type;
        this.name = data.name;
        this.loc = data.loc;
        this.range = data.range;
    }
}