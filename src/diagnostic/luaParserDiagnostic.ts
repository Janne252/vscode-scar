'use strict';

import {Diagnostic, Range, Position, DiagnosticSeverity} from 'vscode';
import {ILuaParseError} from 'luaparse';

/**
 * Represents a Diagnostic for LuaParser errors.
 */
export default class LuaParserDiagnostic extends Diagnostic
{
    /**
     * Creates a new instance of LuaParserDiagnostic.
     * @param error The error used for creating the Diagnostic item.
     */
    constructor(error: ILuaParseError)
    {
        let errorRange = new Range(
            new Position(error.line - 1, error.column),
            new Position(error.line - 1, 1000)
        );
        
        super(errorRange, `${error.name}\n${error.message.substr(error.message.indexOf(']') + 1)}`, DiagnosticSeverity.Error);
    }
}