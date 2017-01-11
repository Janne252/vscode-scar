import {Diagnostic, DiagnosticSeverity, Position, Range, TextDocument} from 'vscode';
import ObjectIterator from '../helper/objectIterator';

var parser = require('luaparse');

import LuaParserCallExpression from './luaParserCallExpression';

export default class LuaParser
{
    public textDocument: TextDocument;
    public options: ILuaParserOptions;
    public ast: Object;
    public valid: boolean = true;
    public lastError: Error = undefined;

    constructor(options: ILuaParserOptions)
    {
        this.options = options;
    }

    public parse(): Object
    {
        return (<ILuaParse>parser).parse(this.textDocument.getText(), this.options);
    }

    public tryParse(): void
    {
        try
        {
            let result = this.parse();
            
            this.ast = result;
            this.valid = true;
            this.lastError = undefined;
        }
        catch(error)
        {   
            this.valid = false;
            this.lastError = error;
        }
        finally
        {

        }
    }

    public getNodeAt(pos: Position): ILuaParserTreeNode
    {
        let result: ILuaParserTreeNode;

        ObjectIterator.each(this.ast, function(key, item: ILuaParserTreeNode)
        {
            if (item !== null && item.loc !== undefined)
            {
                let range = new Range(
                    new Position(item.loc.start.line - 1, item.loc.start.column - 1), 
                    new Position(item.loc.end.line - 1, item.loc.end.column - 1)
                );

                if (range.contains(pos))
                {
                    result = item;
                }
            }
        });

        return result;
    }
    
    public getCallExpressionAt(pos: Position): LuaParserCallExpression
    {
        let result: LuaParserCallExpression;
        
        ObjectIterator.each(this.ast, function(key, value: ILuaParserCallExpression)
        {
            let item = new LuaParserCallExpression(value);

            if (item !== null && item.type === 'CallExpression')
            {
                let argumentsRange = item.getArgumentsRange();

                if (argumentsRange.contains(pos))
                {
                    result = item;
                }
            }
        });

        return result;
    }
}

export interface ILuaParserOptions
{
    wait?: boolean;
    comments?: boolean;
    scope?: boolean;
    locations?: boolean;
    ranges?: boolean;
    oncreateNode?: (node:any) => void;
    oncreateScope?: (scope:any) => void;
    ondestroyscope?: (scope:any) => void;
    luaversion?: string;
}

export interface ILuaParse 
{
    defaultOptions: ILuaParserOptions;
    parse: (input: string | ILuaParserOptions, options?: ILuaParserOptions) => ILuaParser;
}

export interface ILuaParser
{
    write: (input: string) => void;
    end: (input: string) => Object;
}

export interface ILuaParserError
{
    line: number;
    index: number;
    column: number;
    name: string;
    message: string;
    toString(): string;
}

export interface ILuaParserTreeNode
{
    type?: string;
    loc?: ILuaParserTreeLocation;
    range?: ILuaParserTreeRange;
    name?: string;
    value?: any;
    raw?: string;
}

export interface ILuaParserTreeLocation
{
    start: ILuaParserTreePosition;
    end: ILuaParserTreePosition;
}

export interface ILuaParserTreePosition
{
    line: number;
    column: number;
}

export interface ILuaParserTreeRange
{
    [0]:number;
    [1]:number;
}

export interface ILuaParserCallExpression
{
    type: string;
    base: ILuaParserCallExpressionBase;
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
    arguments: ILuaParserCallExpressionArgument[];
}

export interface ILuaParserCallExpressionBase
{
    type: string;
    name: string;
    loc: ILuaParserTreeLocation;
}
export interface ILuaParserCallExpressionArgument
{
    type: string;
    name: string;
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
}

export interface ILuaParserFunctionDeclaration
{
    type: string;
    identifier: {type: string, name: string};
    isLocal: boolean;
    parameters: ILuaParserFunctionDeclarationParameter[];
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
}

export interface ILuaParserFunctionDeclarationParameter
{
    type: string;
    name: string;
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
}

export function LuaParserTreeLocationToRange(loc: ILuaParserTreeLocation): Range
{
    return new Range(
        new Position(loc.start.line - 1, loc.start.column),
        new Position(loc.end.line - 1, loc.end.column)
    );
}