'use strict';

import {ILuaParserCommentNode, ILuaParserAstRootNode} from 'luaparse';
import WorkspaceParserConfig from './parserConfig';

/**
 * Documentation parser that supports LDoc format: https://github.com/stevedonovan/LDoc
 */
export default class WorkspaceLuaFunctionDocumentation
{
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
    constructor(config: WorkspaceParserConfig, ast: ILuaParserAstRootNode, line: number)
    {
        this.returns = '';
        this.descriptionLines = [];
        this.parameters = {};
        
        if (ast.comments === undefined)
        {
            this.documentationFound = false;
            return;
        }

        let comments = ast.comments;
        let targetLine = line; 

        let commentsAboveFunction: ILuaParserCommentNode[] = [];
        let comment: ILuaParserCommentNode;

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
        
        for(let comment of commentsAboveFunction)
        {
            let ENTRY_PARAM = config.lDocParameterDefinition;
            let ENTRY_RETURN = config.lDocFunctionReturnDefinition;

            let paramIndex = comment.value.indexOf(ENTRY_PARAM);
            let returnIndex = comment.value.indexOf(ENTRY_RETURN);

            if (comment.value.indexOf(ENTRY_PARAM) == -1 && comment.value.indexOf(ENTRY_RETURN) == -1)
            {
                this.descriptionLines.push(comment.value);
            }   
            else if(paramIndex != -1)
            {
                let entry = comment.value.substring(paramIndex + ENTRY_PARAM.length + 1);
                let firstSpaceIndex = entry.indexOf(' ');
                firstSpaceIndex = firstSpaceIndex > -1 ? firstSpaceIndex : entry.length;

                let name = entry.substring(0, firstSpaceIndex);
                let description = entry.substring(firstSpaceIndex + 1);

                this.parameters[name] = {
                    name: name,
                    description: description
                };
            }   
            else if (returnIndex != -1)
            {   
                this.returns = comment.value.substring(returnIndex + ENTRY_RETURN.length + 1);
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
