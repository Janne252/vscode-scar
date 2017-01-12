'use strict';

import {SignatureHelp} from 'vscode';
import {StaticSignatureHelpSourceBase} from './staticSignatureHelpSourceBase';
import LuaDocCompletionItemSource from '../completionItemSource/luaDocCompletionItemSource';
import LuaFunctionSignatureHelp from '../signatureHelp/luaFunctionSignatureHelp';

export default class LuaDocSignatureHelpSource extends StaticSignatureHelpSourceBase<LuaDocCompletionItemSource>
{
    protected signatureHelpItems: LuaFunctionSignatureHelp[];
    protected signatureHelpDictionary: {[key: string]: LuaFunctionSignatureHelp};

    constructor(source: LuaDocCompletionItemSource)
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