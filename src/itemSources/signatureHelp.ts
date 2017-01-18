'use strict';

import {SignatureHelp} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

/**
 * Base interface for SignatureHelp in an item source.
 */
export interface ISignatureHelp extends SignatureHelp, IItem 
{
    /**
     * Total number of parameters.
     */
    parameterCount: number;
    /**
     * Whether or not the last parameter is an argument list (...).
     */
    lastParameterIsList: boolean;
}

/**
 * Base interface for workspace SignatureHelp items.
 */
export interface IWorkspaceSignatureHelp extends ISignatureHelp
{
    /**
     * The path to the file the SignatureHelp origintes from.
     */
    filepath: string;
}