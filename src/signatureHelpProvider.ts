'use strict';

import {SignatureHelpProvider as ISignatureHelpProvider, TextDocument, Position, CancellationToken} from 'vscode';
import ItemSourceMerger from './itemSourceMerger/merger';
import {ISignatureHelp} from './itemSources/signatureHelp';

import LuaParser from './luaParser/luaParser';

export default class SignatureHelpProvider implements ISignatureHelpProvider
{
    protected merger: ItemSourceMerger<ISignatureHelp>;
    protected luaParser:LuaParser;
    protected lastSignatureHelp: ISignatureHelp;
    protected lastSIgnatureHelpActiveParamIncremented: boolean = false;

    constructor(merger: ItemSourceMerger<ISignatureHelp>, luaParser: LuaParser)
    {
        this.merger = merger;
        this.luaParser = luaParser;
    }

    public provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): ISignatureHelp
    {
        //console.log(`Attempting to provide help at ${position.line}, ${position.character}`);
        try
        {
            let callExpression = this.luaParser.getCallExpressionAt(position);

            if (this.luaParser.valid && callExpression === undefined)
            {
                this.lastSignatureHelp = undefined;
                this.lastSIgnatureHelpActiveParamIncremented = false;

                return undefined;
            }

            let name = callExpression.base.name;

            let help = this.merger.getItem((item) => item.name == name);

            help.activeParameter = callExpression.getArgumentIndex(position, 0);

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
        catch(exception)
        {
            if (!this.luaParser.valid && this.lastSignatureHelp !== undefined)
            {
                if (
                    !this.lastSIgnatureHelpActiveParamIncremented && 
                    (!this.lastSignatureHelp.lastParameterIsList || this.lastSignatureHelp.activeParameter < this.lastSignatureHelp.parameterCount - 1)
                )
                {
                    this.lastSignatureHelp.activeParameter++;
                    this.lastSIgnatureHelpActiveParamIncremented = true;
                }

                return this.lastSignatureHelp;
            }
        }
    } 
}