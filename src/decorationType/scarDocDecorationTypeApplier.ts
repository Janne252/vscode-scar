'use strict';

import {ILuaParseNode} from 'luaparse';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaParser, {LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from '../decorationType/decorationTypes';
import {SCARDocParser} from '../scar';

/**
 * Represents a DecorationType applier for SCARDOC functions and enums.
 * Uses SCARDocParser as the source data type.
 */
export default class SCARDocDecorationTypeApplier extends DecorationTypeApplierBase<SCARDocParser>
{
    /**
     * Creates a new instance of SCARDocDecorationTypeApplier.
     * @param source The source of the entries to highlight.
     */
    constructor(source: SCARDocParser, luaParser: LuaParser)
    {
        super(source, luaParser);
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor): void
    {
        let scarDocFunctionRanges: Range[] = [];
        let scarDocEnumRanges: Range[] = [];

        if (this.luaParser.valid)
        {
            console.time('SCARDocDecorationTypeApplier');
            for(let func of this.source.functions)
            {
                for(let call of this.luaParser.callExpressions)
                {
                    if (func.name == call.base.name)
                    {
                        scarDocFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
            
            for (let scarDocEnum of this.source.enums)
            {
                for (let identifier of this.luaParser.identifiers)
                {
                    if (scarDocEnum.name == identifier.name)
                    {
                        scarDocEnumRanges.push(LuaParserTreeLocationToRange(identifier.loc));
                    }
                }
            }
                                    
            textEditor.setDecorations(SCARDocFunctionDecorationType, scarDocFunctionRanges);
            textEditor.setDecorations(SCARDocEnumDecorationType, scarDocEnumRanges);
            console.timeEnd('SCARDocDecorationTypeApplier');
        }
    }
}