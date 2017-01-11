'use strict';

import {DiagnosticCollection, TextDocument, Uri} from 'vscode';
import LuaParser, {ILuaParserError} from './luaParser/luaParser';
import LuaParserDiagnostic from './diagnostic/LuaParserDiagnostic';

export default class DiagnosticProvider
{
    public diagnosticCollection: DiagnosticCollection;
    public luaParser: LuaParser;

    constructor(luaparser: LuaParser, diagnosticCollection: DiagnosticCollection)
    {
        this.luaParser = luaparser;
        this.diagnosticCollection = diagnosticCollection;
    }

    public update(textDocument: TextDocument)
    {
        this.luaParser.textDocument = textDocument;
        this.luaParser.tryParse();

        this.diagnosticCollection.clear();

        if (this.luaParser.lastError)
        {
            this.diagnosticCollection.set(textDocument.uri, [new LuaParserDiagnostic(<ILuaParserError>this.luaParser.lastError)]);
        }
    }
}