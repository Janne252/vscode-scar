'use strict';

import {CompletionItem, CompletionItemKind, ParameterInformation} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import StaticItemSource from '../itemSourceMerger/staticSource';
import {ISCARDoc, ILuaDoc, ILuaFunctionDefinition} from '../scar';
import {IHover} from './hover';
import {getLuaFunctionSignature} from '../scar';

/**
 * Represents a static source of Lua/SCAR documentation SignatureHelp items.
 */
class DocHoverSource extends StaticItemSource<IHover>
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

			this.items.push(<IHover>{
                id: func.name,
                name: func.name,
                contents: [signature, func.description]
			});
		}

        for(let docEnum of doc.enums)
        {
            this.items.push(<IHover>{
                id: docEnum.name,
                name: docEnum.name,
                contents: [docEnum.name, docEnum.description !== undefined ? docEnum.description : `${docEnum.name} of type ${docEnum.type}`]
            });
        }
	}
}

/**
 * Represents a static source of SCARDoc Hover items.
 */
export class SCARDocHoverSource extends DocHoverSource
{
    /**
     * Creates a new instance of SCARDocHoverSource.
     * @param data The SCARDoc to pull the information from.
     */
    constructor(data: ISCARDoc)
    {
        super('scarDocHovers', data);
    }
}

/**
 * Represents a static source of LuaDoc Hover items.
 */
export class LuaDocHoverSource extends DocHoverSource
{
    /**
     * Creates a new instance of LuaDocHoverSource.
     * @param data The LuaDoc to pull the information from.
     */
    constructor(data: ILuaDoc)
    {
        super('luaDocHovers', data);
    }
}