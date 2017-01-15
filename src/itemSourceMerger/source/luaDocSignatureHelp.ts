'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceSignatureHelp} from '../item/signatureHelp';

class DocSignatureHelpSource extends StaticItemSource<ISourceSignatureHelp>
{
	constructor(id: string, scarDoc: ISCARDoc | ILuaDoc)
	{
		super(id, []);

		for (let func of scarDoc.functions)
		{
            let signature = this.getSignature(func);
            let parameters = this.getParameters(func);

			this.items.push(<ISourceSignatureHelp>{
                id: func.name,
                activeParameter: 0,
                activeSignature: 0,
                signatures: [
                    {
                        label: signature,
                        documentation: func.description,
                        parameters: parameters
                    }
                ],
                parameterCount: parameters.length,
                lastParameterIsList: parameters.length > 0 ? parameters[parameters.length - 1].label == '...' : false
			});
		}
	}

    protected getParameters(func: ILuaFunctionDefinition): ParameterInformation[]
    {
        let result: ParameterInformation[] = [];
        
        for(let param of func.parameters)
        {
            result.push({
                label: param.name,
                documentation: `type: ${param.type}, optional: ${param.optional}`
            });
        }

        return result;
    }

    protected getSignature(func: ILuaFunctionDefinition): string
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
}

export class SCARDocSignatureHelpSource extends DocSignatureHelpSource
{
    constructor(data: ISCARDoc)
    {
        super('scarDocSignatureHelp', data);
    }
}

export class LuaDocSignatureHelpSource extends DocSignatureHelpSource
{
    constructor(data: ILuaDoc)
    {
        super('luaDocSignatureHelp', data);
    }
}