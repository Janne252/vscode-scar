'use strict';

import {SignatureHelp} from 'vscode';
import {StaticSignatureHelpSourceBase} from './staticSignatureHelpSourceBase';
import SCARDocCompletionItemSource from '../completionItemSource/scarDocCompletionItemSource';
import LuaFunctionSignatureHelp from '../signatureHelp/luaFunctionSignatureHelp';
import LuaDocSignatureHelpSource from './LuaDocSignatureHelpSource';

export default class SCARDocSignatureHelpSource  extends StaticSignatureHelpSourceBase<SCARDocCompletionItemSource>
{
    protected signatureHelpItems: LuaFunctionSignatureHelp[];
    protected signatureHelpDictionary: {[key: string]: LuaFunctionSignatureHelp};

    constructor(source: SCARDocCompletionItemSource)
    {
        super(source);
    }

    protected proessData(): void
    {
        for(let luaFunction of this.source.data.functions)
        {
            this.signatureHelpItems.push(new LuaFunctionSignatureHelp(luaFunction));
        }
    }

    protected signatureHelpMatchesName(signatureHelp: LuaFunctionSignatureHelp, name: string): boolean
    {
        return signatureHelp.luaFunction.name == name;
    }
}