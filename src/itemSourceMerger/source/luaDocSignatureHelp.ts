'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceSignatureHelp} from '../item/signatureHelp';

/**
 * Represents a static source of Lua/SCAR documentation SignatureHelp items.
 */
class DocSignatureHelpSource extends StaticItemSource<ISourceSignatureHelp>
{
    /**
     * Creates a new instance of DocSignatureHelpSource.
     * @param id The unique identifier of the source.
     * @param doc The documentation to pull the information from.
     */
	constructor(id: string, doc: ISCARDoc | ILuaDoc)
	{
		super(id, []);

		for (let func of doc.functions)
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
    /**
     * Internally generates an array of ParameterInformation based on a ILuaFunctionDefinition.
     * @param func The function to generate the ParameterInformation[] for.
     */
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
    /**
     * Internally generates a signature string based on a ILuaFunctionDefinition.
     * @param func The ILuaFunctionDefinition to create the signature string from.
     */
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

/**
 * Represents a static source of SCARDoc SignatureHelp items.
 */
export class SCARDocSignatureHelpSource extends DocSignatureHelpSource
{
    /**
     * Creates a new instance of SCARDocSignatureHelpSource.
     * @param data The SCARDoc to pull the information from.
     */
    constructor(data: ISCARDoc)
    {
        super('scarDocSignatureHelp', data);
    }
}

/**
 * Represents a static source of LuaDoc SignatureHelp items.
 */
export class LuaDocSignatureHelpSource extends DocSignatureHelpSource
{
    /**
     * Creates a new instance of LuaDocSignatureHelpSource.
     * @param data The LuaDoc to pull the information from.
     */
    constructor(data: ILuaDoc)
    {
        super('luaDocSignatureHelp', data);
    }
}