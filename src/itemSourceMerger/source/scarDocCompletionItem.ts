'use strict';

import {CompletionItem, CompletionItemKind} from 'vscode';
import {IItem} from '../itemSourceMerger';
import StaticItemSource from './static';
import {ISCARDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

export default class SCARDocCompletionItemSource extends StaticItemSource<ISourceCompletionItem>
{
	constructor(scarDoc: ISCARDoc)
	{
		super('scarDocCompletionItems', []);

		for (let func of scarDoc.functions)
		{
			this.items.push(<ISourceCompletionItem>{
				id: func.name,
				kind: CompletionItemKind.Function,
				label: func.name,
				detail: func.signature,
				documentation: func.description
			});
		}

		for(let scarEnum of scarDoc.enums)
		{	
			this.items.push(<ISourceCompletionItem>{
				id: scarEnum.name,
				kind: CompletionItemKind.Enum,
				label: scarEnum.name,
				detail: scarEnum.type,
				documentation: `${scarEnum.name} of type ${scarEnum.type}`
			});
		}	
	}
}