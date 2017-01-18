'use strict';

import {ILuaParseNode} from 'luaparse';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {IDecorationSet, IDecorationSetCollection} from '../../decorationTypeApplier/types';
import {DecorationTypeApplierBase} from '../../decorationTypeApplier/applierBase';
import LuaParser, {LuaParserTreeLocationToRange} from '../../luaParser/luaParser';
import LuaParserCallExpression from '../../luaParser/callExpression';
import ObjectIterator from '../../helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from '../../decorationTypes/definitions';
import {LuaConstsAutoParser} from '../../scar';

/**
 * Represents a DecorationType applier for LuaConstsAuto.scar blueprint entries.
 * Uses LuaConstsAutoParser as the source data type.
 */
export default class LuaConstsAutoDecorationTypeApplier extends DecorationTypeApplierBase<LuaConstsAutoParser>
{
    /**
     * Creates a new instance of LuaConstsAutoDecorationTypeApplier.
     * @param source The source of the entries to highlight.
     */
    constructor(source: LuaConstsAutoParser, luaParser: LuaParser)
    {
        super(source, luaParser);
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {
        let blueprintRanges: Range[] = [];
        let text = textEditor.document.getText();
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
        
        sets.add(<IDecorationSet>{decorationType: LuaConstsAutoBlueprintDecorationType, ranges: blueprintRanges});
    }
}