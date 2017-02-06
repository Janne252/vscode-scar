'use strict';

import {CompletionItemKind, ParameterInformation} from 'vscode';

export interface ILuaDoc
{
    functions: ILuaFunctionDefinition[];
    enums: ILuaEnumDefinition[];
}

export interface ISCARDoc
{
    functions: ILuaFunctionDefinition[];
    enums: ISCADOCREnumDefinition[];
}

export interface ILuaConstsAutoDoc
{
    blueprints: string[];
}

export interface ILuaFunctionDefinition
{
    name: string;
    signature: string;
    returnType: string;
    parameters: ILuaFunctionDefinitionParameter[];
    description: string;
}

export interface ILuaFunctionDefinitionParameter
{
    name: string;
    optional?: boolean;
    type: string;
    description?: string;
}

export interface ILuaEnumDefinition
{
    name: string;
    type?: string;
    description: string;
    kind: CompletionItemKind;
}

export interface ISCADOCREnumDefinition
{
    name: string;
    type: string;
    description?: string;
    kind?: CompletionItemKind;
}

export interface ILoadableSource<T>
{
    load(): Thenable<T>;
}

import * as fs from 'fs';

export function DumpJSON(data: any): void
{
    fs.writeFileSync('E:/vscode-ext-dev/scar/demo_files/dump.txt', JSON.stringify(data), {encoding: 'utf-8'});
}

export class Parser
{
    protected filepath: string;
    protected encoding: string;

    constructor(filepath: string, encoding: string = 'utf-8')
    {   
        this.filepath = filepath;
        this.encoding = encoding;
    }

    protected processData(data: any): void
    {

    }

    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            fs.readFile(this.filepath, this.encoding, (err, data) =>
            {
                if (err)
                {
                    reject(err);
                }

                this.processData(data);
                resolve();
            });
        });
    }
}

export class SCARDocParser extends Parser implements ISCARDoc
{
    public functions: ILuaFunctionDefinition[];
    public enums: ISCADOCREnumDefinition[];

    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }

    protected processData(data: string): void
    {
        let jsonData = <ISCARDoc>JSON.parse(data);

        this.functions = jsonData.functions;
        this.enums = jsonData.enums;
    }
}

export class LuaDocParser extends Parser implements ILuaDoc
{
    public functions: ILuaFunctionDefinition[];
    public enums: ILuaEnumDefinition[];

    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
    }

    protected processData(data: string): void
    {
        let jsonData = <ILuaDoc>JSON.parse(data);

        this.functions = jsonData.functions;
        this.enums = jsonData.enums;
    }
}

export class LuaConstsAutoParser extends Parser implements ILuaConstsAutoDoc
{
    protected combinedList: string;
    protected _matchAllRegexString: string;
    public blueprints: string[];

    constructor(filepath: string, encoding: string = 'utf-8')
    {
        super(filepath, encoding);
        this.blueprints = [];
    }

    protected processData(data: string): void
    {
        let lines: string[] = data.split(/\r?\n/g);
        
        for(let line of lines)
        {
            if (line.startsWith('--? ') && line.indexOf('@enum') == -1)
            {
                let entry = line.substring(4);

                this.blueprints.push(entry);
            }
        }

        this.combinedList = this.blueprints.join('|');
        this._matchAllRegexString = `\\b(${this.combinedList})\\b`;
    }

    public getMatchAllRegExp(): RegExp
    {
        return new RegExp(this._matchAllRegexString, 'g');
    }
}

/**
 * Internally generates a signature string based on a ILuaFunctionDefinition.
 * @param func The ILuaFunctionDefinition to create the signature string from.
 */
export function getLuaFunctionSignature(func: ILuaFunctionDefinition): string
{
    let result = '';
    let paramNames = [];

    if (func.signature === undefined)
    {
        for(let param of func.parameters)
        {
            paramNames.push(param.name);
        }

        result = `${func.name}(${paramNames.join(', ')})`;
    }
    else
    {
        result = func.signature;
    }

    return result;
}

/**
 * Internally generates an array of ParameterInformation based on a ILuaFunctionDefinition.
 * @param func The function to generate the ParameterInformation[] for.
 */
export function getLuaFUnctionParameterInfo(func: ILuaFunctionDefinition): ParameterInformation[]
{
    let result: ParameterInformation[] = [];
    
    for(let param of func.parameters)
    {
        result.push({
            label: param.name,
            documentation: `type: ${param.type}${(param.optional !== undefined ? `, optional: ${param.optional}` : '')}`
        });
    }

    return result;
}
