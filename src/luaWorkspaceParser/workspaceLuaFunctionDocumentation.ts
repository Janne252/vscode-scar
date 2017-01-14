'use strict';

import {ILuaParserCommentNode} from '../luaParser/luaParser';
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

    /**
     * Creates a new instance of WorkspaceLuaFunctionDocumentation.
     * @param comments Array of comments. Expected to be in the correct oder.
     */
    constructor(comments: ILuaParserCommentNode[])
    {
        this.parameters = {};
        this.descriptionLines = [];
        for(let comment of comments)
        {
            let paramIndex = comment.value.indexOf(ENTRY_PARAM);
            let returnIndex = comment.value.indexOf(ENTRY_RETURN);

            // We have a generic description line.
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
