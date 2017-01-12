'use strict';

import {SignatureHelp} from 'vscode';
import {ActiveSignatureHelpSourceBase} from './activeSignatureHelpSourceBase';
import SCARDocCompletionItemSource from '../completionItemSource/scarDocCompletionItemSource';
import LuaFunctionSignatureHelp from '../signatureHelp/luaFunctionSignatureHelp';
import LuaDocSignatureHelpSource from './LuaDocSignatureHelpSource';

export default class WorkspaceSignatureHelpSource  extends ActiveSignatureHelpSourceBase
{
    constructor()
    {
        super();
    }
}