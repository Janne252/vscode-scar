'use strict';

import {SignatureHelp} from 'vscode';
import {IItem} from '../itemSourceMerger';

export interface ISourceSignatureHelp extends SignatureHelp, IItem 
{
    parameterCount: number;
    lastParameterIsList: boolean;
}