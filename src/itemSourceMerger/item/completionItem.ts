'use strict';

import {CompletionItem} from 'vscode';
import {IItem} from '../itemSourceMerger';

export interface ICompletionItem extends CompletionItem, IItem 
{

}