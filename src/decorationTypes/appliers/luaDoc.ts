'use strict';

import {ILuaParseNode} from 'luaparse';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {IDecorationSet, IDecorationSetCollection} from '../../decorationTypeApplier/types';
import {DecorationTypeApplierBase} from '../../decorationTypeApplier/applierBase';
import LuaParser, {LuaParserTreeLocationToRange} from '../../luaParser/luaParser';
import LuaParserCallExpression from '../../luaParser/callExpression';
import ObjectIterator from '../../helper/objectIterator';
import {LuaDocEnumDecorationType, LuaDocFunctionDecorationType, SCARDocFunctionDecorationType, SCARDocEnumDecorationType} from '../definitions';
import {LuaDocParser, SCARDocParser} from '../../scar';

/**
 * Base DecorationTypeApplier for SCARDocParser and LuaDocParser.
 * Uses LuaDocParser or SCARDocParser as the source data type.
 */
class DocDecorationTypeApplier extends DecorationTypeApplierBase<LuaDocParser | SCARDocParser>
{
    protected functionDecoration: TextEditorDecorationType;
    protected enumDecoration: TextEditorDecorationType;
    /**
     * Creates a new instance of LuaDocDecorationTypeApplier.
     * @param source The source of the entries to highlight.
     */
    constructor(functionDecoration: TextEditorDecorationType, enumDecoration: TextEditorDecorationType, source: LuaDocParser | SCARDocParser, luaParser: LuaParser)
    {
        super(source, luaParser);

        this.functionDecoration = functionDecoration;
        this.enumDecoration = enumDecoration;
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {
        let luaDocFunctionRanges: Range[] = [];
        let luaDocEnumRanges: Range[] = [];

        if (this.luaParser.valid)
        {
            for(let func of this.source.functions)
            {
                for(let call of this.luaParser.callExpressions)
                {
                    if (func.name == call.base.name)
                    {
                        luaDocFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
            for (let scarDocEnum of this.source.enums)
            {
                for (let identifier of this.luaParser.identifiers)
                {
                    if (scarDocEnum.name == identifier.name)
                    {
                        luaDocEnumRanges.push(LuaParserTreeLocationToRange(identifier.loc));
                    }
                }
            }
                                    
            sets.add(<IDecorationSet>{decorationType: this.functionDecoration, ranges: luaDocFunctionRanges});
            sets.add(<IDecorationSet>{decorationType: this.enumDecoration, ranges: luaDocEnumRanges});
        }
    }
}

export class SCARDocDecorationTypeApplier extends DocDecorationTypeApplier
{
    constructor(source: SCARDocParser, luaParser: LuaParser)
    {
        super(SCARDocFunctionDecorationType, SCARDocEnumDecorationType,  source, luaParser);
    }

    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {
        console.time('SCARDocDecorationTypeApplier');
        super.update(textEditor, sets);
        console.timeEnd('SCARDocDecorationTypeApplier');
    }
}

export class LuaDocDecorationTypeApplier extends DocDecorationTypeApplier
{
    constructor(source: LuaDocParser, luaParser: LuaParser)
    {
        super(LuaDocFunctionDecorationType, LuaDocEnumDecorationType, source, luaParser);
    }

    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {
        console.time('LuaDocDecorationTypeApplier');
        super.update(textEditor, sets);
        console.timeEnd('LuaDocDecorationTypeApplier');
    }
}