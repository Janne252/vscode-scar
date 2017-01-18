'use strict';

import {Hover} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

export interface IHover extends Hover, IItem 
{

}

/**
 * Base interface for Workspace CompletionItems.
 */
export interface IWorkspaceHover extends IHover
{
    /**
     * Path to the source file the CompletionItem originates from.
     */
    filepath: string;
}