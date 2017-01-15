'use strict';

import {CompletionItem, CompletionItemKind, TextDocument} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ISCARDoc, ILuaFunctionDefinition} from '../../scar';
import {ISourceCompletionItem} from '../item/completionItem';

/**
 * Represents an active source of document CompletionItems.
 */
export default class DocumentDocCompletionItemSource extends ActiveItemSource<ISourceCompletionItem>
{
    /**
     * Creates a new instance of DocumentDocCompletionItemSource.
     */
	constructor()
	{
		super('documentCompletionItems', []);
	}

    /**
     * Updates the DocumentDocCompletionItemSource with words from a TextDocument.
     * @param textDocument The TextDocument to pull the words from.
     */
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
					id: 'currentDocument_' + word,
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
