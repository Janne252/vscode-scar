'use strict';

import {window, TextEditorDecorationType, TextEditor, Range} from 'vscode';
import LuaParser from '../luaParser/luaParser';
import {IDecorationTypeApplier, IDecorationSetCollection} from './types';

/**
 * Represents an abstract base class for DecorationTypeAppliers.
 * @param T The type of the source data the DecorationTypeApplier uses.
 */
export abstract class DecorationTypeApplierBase<T> implements IDecorationTypeApplier
{
    /**
     * Source data of this DecorationTypeApplier.
     */
    protected source: T;
    /**
     * Lua parser used to get the ast tree of the document.
     */
    protected luaParser: LuaParser;
    /**
     * Creates a new instance of DecorationTypeApplier.
     * @param source The data source.
     * @param luaParser The Lua parser used to parse the document.
     */
    constructor(source: T, luaParser: LuaParser)
    {
        this.source = source;
        this.luaParser = luaParser;
    }
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor, sets: IDecorationSetCollection): void
    {

    }
}
