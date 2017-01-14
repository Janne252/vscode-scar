'use strict';

import {ILuaParserCommentNode, ILuaParserAstRootNode} from '../luaParser/luaParser';
export const ENTRY_PARAM: string = '@param';
export const ENTRY_RETURN: string = '@return';

export default class WorkspaceLuaFunctionDocumentation
{
    protected descriptionLines: string[];
    protected parameterLines: string[];
    public get description(): string
    {
        return this.descriptionLines.join('\n');
    }

    public returns: string;

    public parameters: {[key: string]: IWorkspaceLuaFunctionParameterDocumentation};

    public documentationFound: boolean;

    /**
     * Creates a new instance of WorkspaceLuaFunctionDocumentation.
     * @param comments Array of comments. Expected to be in the correct oder.
     */
    constructor(ast: ILuaParserAstRootNode, line: number)
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

export interface IWorkspaceLuaFunctionParameterDocumentation
{
    name: string;
    description: string;
}
