'use strict';

import {ILuaParseCommentNode, ILuaParseAstRootNode} from 'luaparse';
import WorkspaceParserConfig from './parserConfig';

/**
 * Documentation parser that supports LDoc format: https://github.com/stevedonovan/LDoc
 */
export default class WorkspaceLuaFunctionDocumentation
{
    public examplePrefix: string = '```scar\n';
    public exampleSuffix: string = '```\n';

    protected exampleLines: string[];
    /**
     * List of description lines.
     */
    protected descriptionLines: string[];
    /**
     * List of parameter definition lines.
     */
    protected parameterLines: string[];
    /**
     * The description text.
     */
    public get description(): string
    {
        return this.descriptionLines.join('\n');
    }

    public get examples(): string
    {
        return this.exampleLines.length > 0 ? `${this.examplePrefix}${this.exampleLines.join('\n')}${this.exampleSuffix}` : '';
    }
    /**
     * The @return text.
     */
    public returns: string;
    /**
     * The @param entries.
     */
    public parameters: {[key: string]: IWorkspaceLuaFunctionParameterDocumentation};
    /**
     * Whether or not documentation was found.
     */
    public documentationFound: boolean;
    /**
     * Creates a new instance of WorkspaceLuaFunctionDocumentation.
     * @param ast The AST containing the document comment entries.
     * @param line The line the function is defined at.
     */
    constructor(config: WorkspaceParserConfig, ast: ILuaParseAstRootNode, line: number)
    {
        this.returns = '';
        this.descriptionLines = [];
        this.exampleLines = [];
        this.parameters = {};
        
        if (ast.comments === undefined)
        {
            this.documentationFound = false;
            return;
        }

        let comments = ast.comments;
        let targetLine = line; 

        let commentsAboveFunction: ILuaParseCommentNode[] = [];
        let comment: ILuaParseCommentNode;

        // Lua parser ast tree contains comments in the order of occurrance. 
        // Iterate over the comments in reversed order and see how many comments can be found above the function delcaration.
        for(let i = comments.length - 1; i >= 0; i--)
        {
            comment = comments[i];

            if (comment.loc.start.line == targetLine)
            {
                commentsAboveFunction.push(comment);
                targetLine--;
            }
        }

        this.documentationFound = commentsAboveFunction.length > 0;

        commentsAboveFunction.reverse();
        let parsingExample = false;

        for(let comment of commentsAboveFunction)
        {
            let ENTRY_PARAM = config.lDocParameterDefinition;
            let ENTRY_RETURN = config.lDocFunctionReturnDefinition;
            let ENTRY_EXAMPLE = config.lDocExampleDefinition;

            let paramDefIndex = comment.value.indexOf(ENTRY_PARAM);
            let returnDefIndex = comment.value.indexOf(ENTRY_RETURN);
            let exampleDefIndex = comment.value.indexOf(ENTRY_EXAMPLE);

            if (paramDefIndex != -1 || returnDefIndex != -1)
            {
                parsingExample = false;
            }

            if (paramDefIndex == -1 && returnDefIndex == -1 && exampleDefIndex == -1)
            {
                if (parsingExample)
                {
                    this.exampleLines.push(comment.value);
                }
                else
                {
                    this.descriptionLines.push(comment.value);
                }
            }   
            else if(paramDefIndex != -1)
            {
                let entry = comment.value.substring(paramDefIndex + ENTRY_PARAM.length + 1);
                let firstSpaceIndex = entry.indexOf(' ');
                firstSpaceIndex = firstSpaceIndex > -1 ? firstSpaceIndex : entry.length;

                let name = entry.substring(0, firstSpaceIndex);
                let description = entry.substring(firstSpaceIndex + 1);

                this.parameters[name] = {
                    name: name,
                    description: description
                };
            }   
            else if (returnDefIndex != -1)
            {   
                this.returns = comment.value.substring(returnDefIndex + ENTRY_RETURN.length + 1);
            }
            else if (exampleDefIndex != -1)
            {
                parsingExample = true;
            }
        }
    }
}

/**
 * Represents parameter documentation extracted from LuaParser AST tree comments.
 */
export interface IWorkspaceLuaFunctionParameterDocumentation
{
    /**
     * Name of the parameter.
     */
    name: string;
    /**
     * Description text of the parameter.
     */
    description: string;
}
