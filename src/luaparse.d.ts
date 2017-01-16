
declare module "luaparse"
{
    export function parse(input: string | ILuaParserOptions, options?: ILuaParserOptions): ILuaParserAstRootNode;

    /**
     * The root node returned by luaparse.
     */
    export interface ILuaParserAstRootNode
    {
        body: any[];
        loc: ILuaParserTreeLocation;
        range: ILuaParserTreeRange;
        comments?: ILuaParserCommentNode[];
    }

    /**
     * Comment node.
     */
    export interface ILuaParserCommentNode
    {
        type: string;
        value: string;
        raw: string;
        loc: ILuaParserTreeLocation;
        range: ILuaParserTreeRange;
    }
    /**
     * luaparser options.
     */
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
    /**
     * Typed behavior of luaparse.
     */
    export interface ILuaParse 
    {
        defaultOptions: ILuaParserOptions;
        parse: (input: string | ILuaParserOptions, options?: ILuaParserOptions) => ILuaParserAstRootNode;
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
}