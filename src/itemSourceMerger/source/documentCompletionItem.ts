'use strict';

import {CompletionItem, CompletionItemKind, TextDocument, window} from 'vscode';
import {IItem} from '../itemSourceMerger';
import ActiveItemSource from './active';
import {ISCARDoc, ILuaFunctionDefinition} from '../../scar';
import {ICompletionItem} from '../item/completionItem';

/**
 * Represents an active source of document CompletionItems.
 */
export default class DocumentDocCompletionItemSource extends ActiveItemSource<ICompletionItem>
{
    /**
     * Internal handle for keeping track of the auto update interval.
     */
    protected autoUpdateHandle: NodeJS.Timer;
    /**
     * Whether or not active TextEditor should be updated.
     */
    public shouldUpdate: boolean;
    /**
     * How often shouldUpdate is checked.
     */
    public updateInterval: number;
    /**
     * Creates a new instance of DocumentDocCompletionItemSource.
     */
    constructor(updateInteral: number = 1000)
    {
        super('documentCompletionItems', []);
        this.shouldUpdate = false;
        this.updateInterval = updateInteral;
    }
    /**
     * Internally updates the active TextEditor.
     */
    protected autoUpdate = () =>
    {
        if (this.shouldUpdate && window.activeTextEditor !== undefined)
        {
            this.shouldUpdate = false;
            this.update(window.activeTextEditor.document);
        }
    }
    /**
     * Enable auto update.
     */
    public startAutoUpdate(): void
    {
        if (this.autoUpdateHandle === undefined)
        {
            this.autoUpdateHandle = setInterval(this.autoUpdate, this.updateInterval);
        }
    }
    /**
     * Disable auto update.
     */
    public stopAutoUpdate(): void
    {
        if (this.autoUpdateHandle !== undefined)
        {
            clearInterval(this.autoUpdateHandle);
        }
    }
    /**
     * Updates the DocumentDocCompletionItemSource with words from a TextDocument.
     * @param textDocument The TextDocument to pull the words from.
     */
    public update(textDocument: TextDocument): void
    {
        let text = textDocument.getText();

        let words = text.match(/\w+/g);
        let result: ICompletionItem[] = [];
        
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
                result.push(<ICompletionItem>{
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
