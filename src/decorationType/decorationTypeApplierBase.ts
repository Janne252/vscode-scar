'use strict';

import {window, TextEditorDecorationType} from 'vscode';
import LuaParser from '../luaParser/luaParser';

export abstract class DecorationTypeApplierBase<T> implements IDecorationTypeApplier
{
    public source: T;
    public luaParser: LuaParser;

    constructor(source: T, luaParser: LuaParser)
    {
        this.source = source;
        this.luaParser = luaParser;
    }

    public update(): void
    {

    }
}

export interface IDecorationTypeApplier
{
    update(): void;
}