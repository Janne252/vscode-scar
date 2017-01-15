'use strict';
import {TextEditorDecorationType, Range, Position, TextEditor} from 'vscode';
import {DecorationTypeApplierBase} from './decorationTypeApplierBase';
import LuaParser, {ILuaParserTreeNode, LuaParserTreeLocationToRange} from '../luaParser/luaParser';
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
        //console.log('highligting file (SCAR): ' + textEditor.document.uri.path);  

        let callExpressions: LuaParserCallExpression[] = [];
        let identifiers: ILuaParserTreeNode[] = [];
        let scarDocFunctionRanges: Range[] = [];
        let scarDocEnumRanges: Range[] = [];

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
                    else if (value.type == 'Identifier')
                    {
                        identifiers.push(value);
                    }
                }
            });

            for(let func of this.source.functions)
            {
                for(let call of callExpressions)
                {
                    if (func.name == call.base.name)
                    {
                        scarDocFunctionRanges.push(call.getIdentifierRange());
                    }
                }
            }
            
            for (let scarDocEnum of this.source.enums)
            {
                for (let identifier of identifiers)
                {
                    if (scarDocEnum.name == identifier.name)
                    {
                        scarDocEnumRanges.push(LuaParserTreeLocationToRange(identifier.loc));
                    }
                }
            }
                                    
            textEditor.setDecorations(SCARDocFunctionDecorationType, scarDocFunctionRanges);
            textEditor.setDecorations(SCARDocEnumDecorationType, scarDocEnumRanges);
        }
    }
}