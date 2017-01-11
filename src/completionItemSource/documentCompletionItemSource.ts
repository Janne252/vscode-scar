'use strict';

import {CompletionItem, TextDocument} from 'vscode';
import DocumentWordCompletionItem from '../completionItem/documentWordCompletionItem';
import ActiveCompletionItemSource from './activeCompletionItemSource';

/**
 * Abstract base class for providing a source for active completion items.
 */
export default class DocumentCompletionItemSource extends ActiveCompletionItemSource
{
    constructor()
    {
        super();
    }

    public update(textDocument: TextDocument): void
    {
        let text = textDocument.getText();

        let words = text.match(/\w+/g);
        let result: CompletionItem[] = [];
        
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
                result.push(new DocumentWordCompletionItem(word));
            }
        }

        this.updateCompletionItems(result);
    }
}