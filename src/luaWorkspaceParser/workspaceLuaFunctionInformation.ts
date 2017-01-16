'use strict';

import {ILuaFunctionDefinitionParameter} from '../scar';
import {ILuaParserAstRootNode, ILuaParserFunctionDeclaration, ILuaParserFunctionDeclarationParameter} from 'luaparse';

import WorkspaceLuaFunctionDocumentation from './workspaceLuaFunctionDocumentation';
import {} from '.'
/**
 * Extracts relevant information of a Lua function from an AST.
 */
export default class WorkspaceLuaFunctionInformation
{
    /**
     * The path to the file the Lua function originates from.
     */
    public filepath: string;
    /**
     * Name of the funcction.
     */
    public name: string;
    /**
     * Signature of the function.
     */
    public signature: string;
    /**
     * Description of the function.
     */
    public description: string;
    /**
     * Parameters of the function.
     */
    public parameters: ILuaFunctionDefinitionParameter[];
    /**
     * Creates a new instance of WorkspaceLuaFunctionInformation.
     * @param filepath Path to the file the function originates from.
     * @
     */
    constructor(config, filepath: string, ast: ILuaParserAstRootNode, node: ILuaParserFunctionDeclaration)
    {
        this.filepath = filepath;
        this.parameters = [];
        let paramNames: string[] = [];

        let param: ILuaParserFunctionDeclarationParameter;
        for(let i = 0; i < node.parameters.length; i++)
        {
            param = node.parameters[i];
            this.parameters.push({
                name: param.name,
                type: 'any',
                optional: false
            });
            paramNames.push(param.name);
        }

        this.name = node.identifier.name;
        this.signature = `${this.name}(${paramNames.join(', ')})`;
        this.description = `File: ${filepath}, line ${node.loc.start.line}`;

        let doc = new WorkspaceLuaFunctionDocumentation(config, ast, node.loc.start.line - 1);

        if (doc.documentationFound)
        {
            for(let parameter of this.parameters)
            {
                if (doc.parameters[parameter.name])
                {
                    parameter.description = doc.parameters[parameter.name].description;
                }
            }

            this.description = `${doc.description} ${doc.returns} ${this.description}`;
        }
    }
}