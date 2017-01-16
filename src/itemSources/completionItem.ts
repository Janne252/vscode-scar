'use strict';

import {CompletionItem} from 'vscode';
import {IItem} from '../itemSourceMerger/types';

export interface ICompletionItem extends CompletionItem, IItem 
{

}