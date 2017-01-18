import {Position, Range} from 'vscode';
import {ILuaParseCallExpressionNode, ILuaParseCallExpressionBase, ILuaParseNodeLocation, ILuaParseNodeRange, ILuaParseCallExpressionArgument} from 'luaparse';
import {LuaParserTreeLocationToRange} from './luaParser';

/**
 * Represents a CallExpression parsed by luaparser.
 */
export default class LuaParserCallExpression implements ILuaParseCallExpressionNode
{
    public type: string;
    public base: ILuaParseCallExpressionBase;
    public loc: ILuaParseNodeLocation;
    public range: ILuaParseNodeRange;
    public arguments: ILuaParseCallExpressionArgument[];

    constructor(data: ILuaParseCallExpressionNode)
    {
        this.type = data.type;
        this.base = data.base;
        this.loc = data.loc;
        this.range = data.range;
        this.arguments = data.arguments;
    }

    public getIdentifierRange(): Range
    {
        return LuaParserTreeLocationToRange(this.base.loc);
    }

    public getArgumentsRange(): Range
    {
        let firstArgument = this.arguments[0];
        let lastArgument = this.arguments[this.arguments.length - 1];

        return new Range(
            this.arguments.length > 0 ? 
                new Position(firstArgument.loc.start.line - 1, firstArgument.loc.start.column) : 
                new Position(this.loc.start.line - 1, this.loc.start.column + this.base.name.length + 1),
            this.arguments.length > 0 ? 
                new Position(lastArgument.loc.end.line - 1, lastArgument.loc.end.column) : 
                new Position(this.loc.end.line - 1, this.loc.end.column - 1)
        );
    }

    public isPositionInArgumentsRange(position: Position): boolean
    {
        let range = this.getArgumentsRange();

        let start = range.start;
        let end = range.end;

        let lineCount = end.line - start.line + 1;

        return  (lineCount == 1 && position.line == start.line && position.character >= start.character && position.character <= end.character) ||
                (lineCount > 1 && position.line == start.line && position.character >= start.character) || 
                (lineCount > 1 && position.line == end.line && position.character <= end.character) || 
                (lineCount > 1 && position.line > start.line && position.line < end.line);
    }

    /**
     * Finds the index of the argument at a given position.
     * @param pos The position to get the argument index from.
     * @param defaultTo Default value to return if an argument was not found.
     * Returns the argument index or defaultTo value.
     */
    public getArgumentIndex(pos: Position, defaultTo: number = -1)
    {
        let arg: ILuaParseCallExpressionArgument;

        for(let i = 0; i < this.arguments.length; i++)
        {
            arg = this.arguments[i];

            let range = new Range(
                new Position(arg.loc.start.line - 1, arg.loc.start.column - 1),
                new Position(arg.loc.end.line - 1, arg.loc.end.column)
            )

            if (range.contains(pos))
            {
                return i;
            }
        }

        return defaultTo;
    }

    public getMemberCallExpressionName(): string
    {
        let base = this.base;
        let parts = [];

        while(true)
        {
            if (base.base !== undefined)
            {
                parts.push(base.identifier.name);
            }
            else
            {
                parts.push(base.name);
                break;
            }

            base = base.base;
        }

        parts.reverse();

        return parts.join('.');
    }
}