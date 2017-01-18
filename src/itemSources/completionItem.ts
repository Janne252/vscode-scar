'use strict';

import {CompletionItem} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

/**
 * Base interface for CompletionItem in an item source.
 */
export interface ICompletionItem extends CompletionItem, IItem 
{

}

/**
 * Base interface for Workspace CompletionItems.
 */
export interface IWorkspaceCompletionItem extends ICompletionItem
{
    /**
     * Path to the source file the CompletionItem originates from.
     */
    filepath: string;
}