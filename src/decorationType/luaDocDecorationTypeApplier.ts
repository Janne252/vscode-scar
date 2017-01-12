'use strict';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaDocCompletionItemSource from '../completionItemSource/luaDocCompletionItemSource';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {LuaDocEnumDecorationType, LuaDocFunctionDecorationType} from '../decorationType/decorationTypes';
import {DumpJSON} from '../scar';

export default class LocDocDecorationTypeApplier extends DecorationTypeApplierBase<LuaDocCompletionItemSource>
{
    constructor(source: LuaDocCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }

    public update(textEditor: TextEditor): void
    {
        //console.log('highligting file (LuaDoc): ' + textEditor.document.uri.path);  

        let callExpressions: LuaParserCallExpression[] = [];
        let identifiers: ILuaParserTreeNode[] = [];
        let luaDocFunctionRanges: Range[] = [];
        let luaDocEnumRanges: Range[] = [];

        if (this.luaParser.valid)
        {
            ObjectIterator.each(this.luaParser.ast, (key: any, value: any) => 
            {
                if (value != null)
                {
                    if (value.type === 'CallExpression')
                    {
                        let expression = new LuaParserCallExpression(value);

                        if (expression.base.name === undefined && expression.base.type == 'MemberExpression')
                        {
                            expression.base.name = expression.getMemberCallExpressionName();
                        }

                        callExpressions.push(expression);
                    }
                    else if (value.type == 'Identifier')
                    {
                        identifiers.push(value);
                    }
                }
            });

            for(let func of this.source.data.functions)
            {
                for(let call of callExpressions)
                {
                    if (func.name == call.base.name)
                    {
                        luaDocFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
            
            for (let scarDocEnum of this.source.data.enums)
            {
                for (let identifier of identifiers)
                {
                    if (scarDocEnum.name == identifier.name)
                    {
                        luaDocEnumRanges.push(LuaParserTreeLocationToRange(identifier.loc));
                    }
                }
            }
                                    
            textEditor.setDecorations(LuaDocFunctionDecorationType, luaDocFunctionRanges);
            textEditor.setDecorations(LuaDocEnumDecorationType, luaDocEnumRanges);
        }
    }
}