'use strict';

import {ILuaParseNode} from 'luaparse';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {IDecorationSet, IDecorationSetCollection} from '../../decorationTypeApplier/types';
import {DecorationTypeApplierBase} from '../../decorationTypeApplier/applierBase';
import WorkspaceCompletionItemSource from '../../itemSources/workspaceCompletionItem';
import LuaParser, {LuaParserTreeLocationToRange} from '../../luaParser/luaParser';
import LuaParserCallExpression from '../../luaParser/callExpression';
import ObjectIterator from '../../helper/objectIterator';
import {WorkspaceFunctionDecorationType} from '../definitions';

export default class WorkspaceDecorationTypeApplier extends DecorationTypeApplierBase<WorkspaceCompletionItemSource>
{
    constructor(source: WorkspaceCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {
        let workspaceFunctionRanges: Range[] = [];
        if (this.luaParser.valid)
        {
            let functions = this.source.getAllItems();

            for(let func of functions)
            {
                for(let call of this.luaParser.callExpressions)
                {
                    if (func.label == call.base.name)
                    {
                        workspaceFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
                 
            sets.add(<IDecorationSet>{decorationType: WorkspaceFunctionDecorationType, ranges: workspaceFunctionRanges});
        }
    }
}