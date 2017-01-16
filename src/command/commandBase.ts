'use strict';

import {Disposable, commands} from 'vscode';

/**
 * Represents an abstract vscode Command handler.
 */
export abstract class CommandBase extends Disposable
{
    /**
     * The command to listen for.
     */
    protected command: string;
    /**
     * The disposable object that is created by vscode.commands.registerCommand.
     */
    protected disposable: Disposable;
    /**
     * Creates a new instance of CommandBase.
     * @param command The command to listen for.
     */
    constructor(command: string)
    {
        super(undefined);
        this.command = command;
        this.disposable = commands.registerCommand(this.command, (args) => 
        {
            this.commandExecuted(args);
        });
    }
    /**
     * Command handler.
     * @param args The arguments passed from the command.
     */
    protected commandExecuted(args: any[]): void
    {

    }
    /**
     * Disposes the object.
     */
    public dispose(): any
    {
        if (this.disposable !== undefined)
        {
            this.disposable.dispose();
        }

        super.dispose();
    }
}