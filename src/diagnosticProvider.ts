'use strict';

import {ILuaParseError} from 'luaparse';
import {DiagnosticCollection, TextDocument, Uri} from 'vscode';
import LuaParser from './luaParser/luaParser';
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
        console.time('DiagnosticProvider');
        this.luaParser.textDocument = textDocument;
        this.luaParser.tryParse();
        this.luaParser.parseCallExpressionsAndDefinitions();
        
        this.diagnosticCollection.clear();

        if (this.luaParser.lastError)
        {
            this.diagnosticCollection.set(textDocument.uri, [new LuaParserDiagnostic(<ILuaParseError>this.luaParser.lastError)]);
        }
        console.timeEnd('DiagnosticProvider');
    }
}