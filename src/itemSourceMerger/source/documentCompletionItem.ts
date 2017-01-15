'use strict';

import {CompletionItem, CompletionItemKind, TextDocument} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ISCARDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

export default class DocumentDocCompletionItemSource extends ActiveItemSource<ISourceCompletionItem>
{
	constructor()
	{
		super('documentCompletionItems', []);
	}

    public update(textDocument: TextDocument): void
    {
        let text = textDocument.getText();

        let words = text.match(/\w+/g);
        let result: ISourceCompletionItem[] = [];
        
        let exists: boolean = false;
        for(let word of words)
        {
            exists = false;
            for (let existing of result)
            {
                if (word == existing.label)
                {
                    exists = true;
                    break;
                }
            }

            if (!exists)
            {
                result.push(<ISourceCompletionItem>{
					id: word,
					kind: CompletionItemKind.Text,
					label: word,
					detail: 'word',
					documentation: 'current document word'
				});
            }
        }

		this.updateItems(result);
	}
}
