'use strict';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaConstsAutoCompletionItemSource from '../completionItemSource/luaConstsAutoCompletionItemSource';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from '../decorationType/decorationTypes';

import * as fs from 'fs';
export default class LuaConstsAutoDecorationTypeApplier extends DecorationTypeApplierBase<LuaConstsAutoCompletionItemSource>
{
    constructor(source: LuaConstsAutoCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }

    public update(textEditor: TextEditor): void
    {
        console.log('highligting file (LuaConstsAuto): ' + textEditor.document.uri.path);

        let blueprintRanges: Range[] = [];
        let text = this.luaParser.textDocument.getText();
        let matchAllBlueprints = this.source.getMatchAllRegExp();

        let match: RegExpExecArray;
        while(match = matchAllBlueprints.exec(text))
        {
            let pos = textEditor.document.positionAt(match.index);

            let range = new Range(
                pos,
                new Position(pos.line, pos.character + match[0].length)
            );

            blueprintRanges.push(range);

            //console.log(`found '${match[0]}' at ${match.index}, length: ${match[0].length}`);
            //console.log(JSON.stringify(match));
            //console.log(match);
        }

        textEditor.setDecorations(LuaConstsAutoBlueprintDecorationType, blueprintRanges);
    }
}