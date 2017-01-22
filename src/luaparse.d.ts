/**
 * Type definitions for luaparse module.
 */
declare module "luaparse"
{
    /**
     * Parses the code and returns the Abstract Syntax Tree (AST).
     * @param input The code to parse.
     * @param options ILuaParseOptions used to parse the code.
     */
    export function parse(input: string, options?: ILuaParseOptions): ILuaParseAstRootNode;

    /**
     * The root node returned by luaparse.
     */
    export interface ILuaParseAstRootNode
    {
        body: any[];
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
        comments?: ILuaParseCommentNode[];
    }

    /**
     * Comment node.
     */
    export interface ILuaParseCommentNode
    {
        type: string;
        value: string;
        raw: string;
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
    }
    /**
     * luaparse options.
     */
    export interface ILuaParseOptions
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
    /**
     * Typed behavior of luaparse.
     */
    export interface ILuaParse 
    {
        defaultOptions: ILuaParseOptions;
        parse: (input: string | ILuaParseOptions, options?: ILuaParseOptions) => ILuaParseAstRootNode;
    }

    export interface ILuaParseError
    {
        line: number;
        index: number;
        column: number;
        name: string;
        message: string;
        toString(): string;
    }

    export interface ILuaParseNode
    {
        type?: string;
        loc?: ILuaParseNodeLocation;
        range?: ILuaParseNodeRange;
        name?: string;
        value?: any;
        raw?: string;
    }

    export interface ILuaParseNodeLocation
    {
        start: ILuaParseNodePosition;
        end: ILuaParseNodePosition;
    }

    export interface ILuaParseNodePosition
    {
        line: number;
        column: number;
    }

    export interface ILuaParseNodeRange
    {
        [0]:number;
        [1]:number;
    }

    export interface ILuaParseCallExpressionNode
    {
        type: string;
        base: ILuaParseCallExpressionBase;
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
        arguments: ILuaParseCallExpressionArgument[];
    }

    export interface ILuaParseCallExpressionBase
    {
        type: string;
        name: string;
        loc: ILuaParseNodeLocation;
        base?: ILuaParseCallExpressionBase;
        identifier: ILuaParseCallExpressionBaseIdenfier;
    }
    export interface ILuaParseCallExpressionArgument
    {
        type: string;
        name: string;
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
    }

    export interface ILuaParseFunctionDeclaration
    {
        type: string;
        identifier: ILuaParseCallExpressionBaseIdenfier
        isLocal: boolean;
        parameters: ILuaParseFunctionDeclarationParameter[];
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
    }

    export interface ILuaParseCallExpressionBaseIdenfier
    {
        type: string;
        indexer?: string;
        name?: string;
    }

    export interface ILuaParseFunctionDeclarationParameter
    {
        type: string;
        name: string;
        loc: ILuaParseNodeLocation;
        range: ILuaParseNodeRange;
    }
}