'use strict';

import {window, TextEditorEdit} from 'vscode';
import {CommandBase} from './commandBase';

/**
 * A command for showing a quickpick list.
 */
export default class QuickPickInsertCommand extends CommandBase
{
    /**
     * The items to display in the quickpick list.
     */
    public items: string[];
    /**
     * Creates a new instance of QuickPickInsertCommand.
     * @param command The command to listen for.
     * @param items The items to display in the quickpick list.
     */
    constructor(command: string, items: string[])
    {
        super(command);

        this.items = items;
    }
    /**
     * Command handler.
     * @param args The arguments passed from the command.
     */
    protected commandExecuted(args: any[]): void
    {
        let result = window.showQuickPick(this.items);
        result.then((value: string) =>
        {
            let textEditor = window.activeTextEditor;
            if (textEditor !== undefined)
            {
                textEditor.edit((editBuilder) => 
                {
                    editBuilder.insert(textEditor.selection.start, value); 
                });
            }
        }); 
    }
}
