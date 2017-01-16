'use strict';

import {SignatureHelp} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

export interface ISignatureHelp extends SignatureHelp, IItem 
{
    parameterCount: number;
    lastParameterIsList: boolean;
}