'use strict';
import {window, TextEditorDecorationType, Range, Position} from 'vscode';
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

    public update(): void
    {
        if (window.activeTextEditor === undefined)
        {
            return;
        }

        let blueprintRanges: Range[] = [];
        let text = this.luaParser.textDocument.getText();

        let matches = this.source.matchAllRegexp.exec('');

        let match: RegExpExecArray;

        /*try
        {
            fs.writeFileSync('E:/vscode-ext-dev/scar/demo_files/test.txt', this.source.matchAllRegexString, {encoding: 'utf-8'});
        }
        catch (error)
        {
            console.log(error);
        }*/

        while((match = this.source.matchAllRegexp.exec(text)) != null)
        {
            let pos = window.activeTextEditor.document.positionAt(match.index);

            let range = new Range(
                pos,
                new Position(pos.line, pos.character + match[0].length)
            );

            blueprintRanges.push(range);

            //console.log(`found '${match[0]}' at ${match.index}, length: ${match[0].length}`);
            //console.log(JSON.stringify(match));
        }

        window.activeTextEditor.setDecorations(LuaConstsAutoBlueprintDecorationType, blueprintRanges);
    }
}