'use strict';

import {SignatureHelpProvider as ISignatureHelpProvider, TextDocument, Position, CancellationToken} from 'vscode';
import ItemSourceMerger from './itemSourceMerger/merger';
import {ISignatureHelp} from './itemSources/signatureHelp';
import LuaParser from './luaParser/luaParser';
import {DumpJSON} from './scar';
import LuaCallParser from './luaCallParser/parser';

export default class SignatureHelpProvider implements ISignatureHelpProvider
{
    protected merger: ItemSourceMerger<ISignatureHelp>;
    protected luaCallParser: LuaCallParser;
    protected lastSignatureHelp: ISignatureHelp;
    protected lastSIgnatureHelpActiveParamIncremented: boolean = false;

    constructor(merger: ItemSourceMerger<ISignatureHelp>, luaCallParser: LuaCallParser)
    {
        this.merger = merger;
        this.luaCallParser = luaCallParser;
    }

    public provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): ISignatureHelp
    {
        let callInfo = this.luaCallParser.getFunctionInfoAt(document.offsetAt(position));

        if (callInfo === undefined)
        {
            return undefined;
        }

        let name = callInfo.functionCall.name;

        let help = this.merger.getItem((item) => item.name == name);

        help.activeParameter = callInfo.parameterIndex;

        if (help.lastParameterIsList)
        {
            if (help.activeParameter > help.parameterCount - 1)
            {
                help.activeParameter = help.parameterCount - 1;
                this.lastSIgnatureHelpActiveParamIncremented = true;
            }
        }

        this.lastSignatureHelp = help;
        this.lastSIgnatureHelpActiveParamIncremented = false;

        return help;
    } 
}