'use strict';

import {CompletionItem} from 'vscode';
import {IItem} from '../itemSourceMerger';

export interface ISourceCompletionItem extends CompletionItem, IItem 
{

}