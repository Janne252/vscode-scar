'use strict';

import {CompletionItem, CompletionItemKind, TextDocument, window, Range, Position} from 'vscode';
import {IItem} from '../itemSourceMerger/types';
import ActiveItemSource from '../itemSourceMerger/activeSource';
import {ISCARDoc, ILuaFunctionDefinition} from '../scar';
import {ICompletionItem} from './completionItem';

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

        let regex = new RegExp(/\w+/, 'g');

        let result: ICompletionItem[] = [];
        let skipCount = 0;

        let match;
        while((match = regex.exec(text)))
        {
            let word: string = match[0];
            let pos = textDocument.positionAt(match.index);

            let range = new Range(
                pos,
                new Position(pos.line, pos.character + match[0].length)
            );

            let exists: boolean = false;

            for (let existing of result)
            {
                if (word == existing.name)
                {
                    exists = true;
                    skipCount++;
                    break;
                }
            }

            if (!exists)
            {
                result.push(<ICompletionItem>{
                    id: 'currentDocument_' + word,
                    name: word,
                    kind: CompletionItemKind.Text,
                    label: word,
                    detail: 'line ' + (range.start.line + 1),
                    documentation: 'current document word at line ' + range.start.line + 1 + ', column ' + (range.start.character + 1)
                });
            }
        }

        this.updateItems(result);
    }
}
