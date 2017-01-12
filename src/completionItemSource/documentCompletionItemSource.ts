'use strict';

import {CompletionItem, TextDocument} from 'vscode';
import DocumentWordCompletionItem from '../completionItem/documentWordCompletionItem';
import {ActiveCompletionItemSourceBase} from './activeCompletionItemSourceBase';

/**
 * Represents a source of document word CompletionItems.
 */
export default class DocumentCompletionItemSource extends ActiveCompletionItemSourceBase
{
    /**
     * Creates a new instance of DocumentCompletionItemSource.
     */
    constructor()
    {
        super();
    }
    /**
     * Updates the CompletionItems.
     * @param textDocument The text document to get the words from.
     */
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