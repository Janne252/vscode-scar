'use strict';

import {CompletionList} from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

import {ISCARDoc, ILuaFunctionDefinition, ISCAREnumDefinition} from '../scar';
import LuaFunctionCompletionItem from '../completionItem/luaFunctionCompletionItem';
import {ActiveCompletionItemSourceBase} from './activeCompletionItemSourceBase';

/**
 * Represents a Workspace completionItem source. Currently used to autocomplete words.
 */
export default class WorkspaceCompletionItemSource extends ActiveCompletionItemSourceBase
{
    /**
     * Creates a new instance of WorkspaceCompletionItemSource.
     */
    constructor()
    {
        super();
    }
}