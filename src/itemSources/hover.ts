'use strict';

import {Hover} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

/**
 * Base interface for Hover in an item source.
 */
export interface IHover extends Hover, IItem 
{

}

/**
 * Base interface for Workspace IWorkspaceHovers.
 */
export interface IWorkspaceHover extends IHover
{
    /**
     * Path to the source file the Hover originates from.
     */
    filepath: string;
}