'use strict';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import workspaceCompletionItemSource from '../completionItemSource/workspaceCompletionItemSource';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {UserDefinedFunctionDecorationStyle} from '../decorationType/decorationTypes';

export default class WorkspaceDecorationTypeApplier extends DecorationTypeApplierBase<workspaceCompletionItemSource>
{
    constructor(source: workspaceCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }

    public update(textEditor: TextEditor): void
    {
        //console.log('highligting file (SCAR): ' + textEditor.document.uri.path);  

        let callExpressions: LuaParserCallExpression[] = [];
        let workspaceFunctionRanges: Range[] = [];

        if (this.luaParser.valid)
        {
            ObjectIterator.each(this.luaParser.ast, (key: any, value: any) => 
            {
                if (value != null)
                {
                    if (value.type === 'CallExpression')
                    {
                        let expression = new LuaParserCallExpression(value);
                        callExpressions.push(expression);
                    }
                }
            });

            let functions = this.source.getCompletionItems();

            for(let func of functions)
            {
                for(let call of callExpressions)
                {
                    if (func.label == call.base.name)
                    {
                        workspaceFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
                 
            textEditor.setDecorations(UserDefinedFunctionDecorationStyle, workspaceFunctionRanges);
        }
    }
}