'use strict';

import {Range, Position} from 'vscode';
import {ILuaFunctionDefinitionParameter} from '../scar';
import {ILuaParseAstRootNode, ILuaParseFunctionDeclaration, ILuaParseFunctionDeclarationParameter} from 'luaparse';

import WorkspaceLuaFunctionDocumentation from './luaFunctionDocumentation';
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
     * Description without filepath.
     */
    public rawDescription: string;

    public examples: string;
    /**
     * Parameters of the function.
     */
    public parameters: ILuaFunctionDefinitionParameter[];

    public range: Range;
    /**
     * Creates a new instance of WorkspaceLuaFunctionInformation.
     * @param filepath Path to the file the function originates from.
     * @
     */
    constructor(config, filepath: string, ast: ILuaParseAstRootNode, node: ILuaParseFunctionDeclaration)
    {
        this.filepath = filepath;
        this.parameters = [];
        let paramNames: string[] = [];
        this.range = new Range(
            new Position(node.loc.start.line - 1, node.loc.start.column),
            new Position(node.loc.end.line - 1, node.loc.end.column)
        );

        let param: ILuaParseFunctionDeclarationParameter;
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
        this.rawDescription = '';
        this.examples = '';

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
            this.rawDescription = `${doc.description} ${doc.returns}`;
            this.examples = doc.examples;
        }
    }
}