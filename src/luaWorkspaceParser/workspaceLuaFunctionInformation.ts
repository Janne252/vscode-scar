'use strict';

import {ILuaFunctionDefinitionParameter} from '../scar';
import {ILuaParserAstRootNode, ILuaParserFunctionDeclaration, ILuaParserFunctionDeclarationParameter} from '../luaParser/luaParser';

import WorkspaceLuaFunctionDocumentation from './workspaceLuaFunctionDocumentation';

export default class WorkspaceLuaFunctionInformation
{
    public filepath: string;
    public name: string;
    public signature: string;
    public description: string;
    public parameters: ILuaFunctionDefinitionParameter[];

    constructor(filepath: string, ast: ILuaParserAstRootNode, node: ILuaParserFunctionDeclaration)
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

        let doc = new WorkspaceLuaFunctionDocumentation(ast, node.loc.start.line - 1);

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