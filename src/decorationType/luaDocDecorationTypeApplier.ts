'use strict';

import {ILuaParseNode} from 'luaparse';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaParser, {LuaParserTreeLocationToRange} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/LuaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {LuaDocEnumDecorationType, LuaDocFunctionDecorationType} from '../decorationType/decorationTypes';
import {LuaDocParser} from '../scar';

/**
 * Represents DecorationType applier for Lua standard library functions and enums.
 * Uses LuaDocParser as the source data type.
 */
export default class LuaDocDecorationTypeApplier extends DecorationTypeApplierBase<LuaDocParser>
{
    /**
     * Creates a new instance of LuaDocDecorationTypeApplier.
     * @param source The source of the entries to highlight.
     */
    constructor(source: LuaDocParser, luaParser: LuaParser)
    {
        super(source, luaParser);
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor): void
    {
        //console.log('highligting file (LuaDoc): ' + textEditor.document.uri.path);  

        let luaDocFunctionRanges: Range[] = [];
        let luaDocEnumRanges: Range[] = [];


        if (this.luaParser.valid)
        {
            console.time('LuaDocDecorationTypeApplier');
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
                                    
            textEditor.setDecorations(LuaDocFunctionDecorationType, luaDocFunctionRanges);
            textEditor.setDecorations(LuaDocEnumDecorationType, luaDocEnumRanges);
            console.timeEnd('LuaDocDecorationTypeApplier');
        }
    }
}