'use strict';
import {window, TextEditorDecorationType, Range, Position} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import ScarDocCompletionItemSource from '../completionItemSource/scarDocCompletionItemSource';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from '../decorationType/decorationTypes';

export default class SCARDocDecorationTypeApplier extends DecorationTypeApplierBase<ScarDocCompletionItemSource>
{
    constructor(source: ScarDocCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }

    public update(): void
    {
        if (window.activeTextEditor === undefined)
        {
            return;
        }

        console.log('highligting file (SCAR): ' + window.activeTextEditor.document.uri.path);  

        let callExpressions: LuaParserCallExpression[] = [];
        let identifiers: ILuaParserTreeNode[] = [];
        let scarDocFunctionRanges: Range[] = [];
        let scarDocEnumRanges: Range[] = [];

        if (this.luaParser.valid)
        {
            //console.log(JSON.stringify(this.luaParser.ast));

            ObjectIterator.each(this.luaParser.ast, (key: any, value: any) => 
            {
                if (value != null)
                {
                    if (value.type === 'CallExpression')
                    {
                        let expression = new LuaParserCallExpression(value);
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
                        scarDocFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
            
            for (let scarDocEnum of this.source.data.enums)
            {
                for (let identifier of identifiers)
                {
                    if (scarDocEnum.name == identifier.name)
                    {
                        scarDocEnumRanges.push(LuaParserTreeLocationToRange(identifier.loc));
                    }
                }
            }
                                    
            window.activeTextEditor.setDecorations(SCARDocFunctionDecorationType, scarDocFunctionRanges);
            window.activeTextEditor.setDecorations(SCARDocEnumDecorationType, scarDocEnumRanges);
        }
    }
}