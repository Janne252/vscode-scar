import {Diagnostic, DiagnosticSeverity, Position, Range, TextDocument} from 'vscode';
import ObjectIterator from '../helper/objectIterator';

var parser = require('luaparse');

import LuaParserCallExpression from './luaParserCallExpression';
import {DumpJSON} from '../scar';

export default class LuaParser
{
    public textDocument: TextDocument;
    public options: ILuaParserOptions;
    public ast: ILuaParserAstRootNode;
    public valid: boolean = true;
    public lastError: Error = undefined;

    constructor(options: ILuaParserOptions)
    {
        this.options = options;
    }

    public parse(): ILuaParserAstRootNode
    {
        return (<ILuaParse>parser).parse(this.textDocument.getText(), this.options);
    }

    tryParseAstFromText(text: string): ILuaParserAstRootNode
    {
        try
        {
            return (<ILuaParse>parser).parse(text, this.options);
        }
        catch (error)
        {
            return undefined;
        }
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
    
    public getCallExpressionAt(position: Position): LuaParserCallExpression
    {
        let result: LuaParserCallExpression;

        ObjectIterator.each(this.ast, function(key, value: ILuaParserCallExpression)
        {
            if (value !== null && value.type === 'CallExpression')
            {
                let item = new LuaParserCallExpression(value);
                
                if (item.base.name === undefined && item.base.type == 'MemberExpression')
                {
                    item.base.name = item.getMemberCallExpressionName();
                }
                
                if (item.isPositionInArgumentsRange(position))
                {
                    result = item;
                }
            }
        });

        return result;
    }
}

export interface ILuaParserAstRootNode
{
    body: any[];
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
    comments?: ILuaParserCommentNode[];
}

export interface ILuaParserCommentNode
{
    type: string;
    value: string;
    raw: string;
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
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
    parse: (input: string | ILuaParserOptions, options?: ILuaParserOptions) => ILuaParserAstRootNode;
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
    base?: ILuaParserCallExpressionBase;
    identifier: ILuaParserCallExpressionBaseIdenfier;
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
    identifier: ILuaParserCallExpressionBaseIdenfier
    isLocal: boolean;
    parameters: ILuaParserFunctionDeclarationParameter[];
    loc: ILuaParserTreeLocation;
    range: ILuaParserTreeRange;
}

export interface ILuaParserCallExpressionBaseIdenfier
{
    type: string;
    indexer?: string;
    name?: string;
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