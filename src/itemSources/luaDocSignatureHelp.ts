'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import StaticItemSource from '../itemSourceMerger/staticSource';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../scar';
import {ISignatureHelp} from './signatureHelp';
import {getLuaFunctionSignature, getLuaFUnctionParameterInfo} from '../scar';

/**
 * Represents a static source of Lua/SCAR documentation SignatureHelp items.
 */
class DocSignatureHelpSource extends StaticItemSource<ISignatureHelp>
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
            let signature = getLuaFunctionSignature(func);
            let parameters = getLuaFUnctionParameterInfo(func);

			this.items.push(<ISignatureHelp>{
                id: func.name,
                name: func.name,
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