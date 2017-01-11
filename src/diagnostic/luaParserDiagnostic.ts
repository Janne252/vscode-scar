'use strict';

import {Diagnostic, Range, Position, DiagnosticSeverity} from 'vscode';
import DiagnosticItem from './diagnosticItem';
import {ILuaParserError} from '../luaParser/luaParser';

export default class LuaParserDiagnostic extends DiagnosticItem
{

    constructor(error: ILuaParserError)
    {
        let errorRange = new Range(
            new Position(error.line - 1, error.column),
            new Position(error.line - 1, 1000)
        );
        
        super(errorRange, error.name + '\n' + error.message.substr(error.message.indexOf(']') + 1), DiagnosticSeverity.Error);
    }
}