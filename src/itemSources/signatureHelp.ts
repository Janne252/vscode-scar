'use strict';

import {SignatureHelp} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

export interface ISignatureHelp extends SignatureHelp, IItem 
{
    parameterCount: number;
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