'use strict';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaConstsAutoCompletionItemSource from '../completionItemSource/luaConstsAutoCompletionItemSource';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from '../decorationType/decorationTypes';
import * as fs from 'fs';

/**
 * Represents a DecorationType applier for LuaConstsAuto.scar blueprint entries.
 * Uses LuaConstsAutoCompletionItemSource as the source data type.
 */
export default class LuaConstsAutoDecorationTypeApplier extends DecorationTypeApplierBase<LuaConstsAutoCompletionItemSource>
{
    /**
     * Creates a new instance of LuaConstsAutoDecorationTypeApplier.
     * @param source The source of the entries to highlight.
     */
    constructor(source: LuaConstsAutoCompletionItemSource, luaParser: LuaParser)
    {
        super(source, luaParser);
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor): void
    {
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
        }

        textEditor.setDecorations(LuaConstsAutoBlueprintDecorationType, blueprintRanges);
    }
}