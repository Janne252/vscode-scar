'use strict';

import {SignatureHelp} from 'vscode';
import {StaticSignatureHelpSourceBase} from './staticSignatureHelpSourceBase';
import SCARDocCompletionItemSource from '../completionItemSource/scarDocCompletionItemSource';
import LuaFunctionSignatureHelp from '../signatureHelp/luaFunctionSignatureHelp';
import LuaDocSignatureHelpSource from './LuaDocSignatureHelpSource';

export default class SCARDocSignatureHelpSource  extends StaticSignatureHelpSourceBase<SCARDocCompletionItemSource>
{
    protected signatureHelpItems: LuaFunctionSignatureHelp[];
    
    constructor(source: SCARDocCompletionItemSource)
    {
        super(source);
    }

    protected processData(): void
    {
        for(let luaFunction of this.source.data.functions)
        {
            this.signatureHelpItems.push(new LuaFunctionSignatureHelp(luaFunction));
        }
    }
}