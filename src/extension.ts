'use strict';

import * as vscode from 'vscode';
import {window, workspace, languages, TextDocument, DiagnosticCollection, Range, Position, TextEditor} from 'vscode';
import * as path from 'path';
import {ILuaFunctionDefinition} from './scar';
import CompletionItemProvider from './completionItemProvider';
import LuaDocCompletionItemSource from './completionItemSource/luaDocCompletionItemSource';
import ScarDocCompletionItemSource from './completionItemSource/scarDocCompletionItemSource';
import LuaConstsAutoCompletionItemSource from './completionItemSource/luaConstsAutoCompletionItemSource';
import DocumentCompletionItemSource from './completionItemSource/documentCompletionItemSource';
import CompletionItemMerger from './completionItemSourceMerger/completionItemSourceMerger';
import LuaParser, {ILuaParserOptions, ILuaParserError, ILuaParserCallExpression} from './luaParser/luaParser';
import LuaParserCallExpression from './luaParser/LuaParserCallExpression';
import LuaParserDiagnostic from './diagnostic/LuaParserDiagnostic';
import DiagnosticProvider from './diagnosticProvider';
import ObjectIterator from './helper/objectIterator';
import {SCARDocFunctionDecorationType, SCARDocEnumDecorationType, LuaConstsAutoBlueprintDecorationType} from './decorationType/decorationTypes';
import SCARDocDecorationTypeApplier from './decorationType/scarDocDecorationTypeApplier';
import LuaConstsAutoDecorationTypeApplier from './decorationType/luaConstsAutoDecorationTypeApplier';
import LuaDocDecorationTypeApplier from './decorationType/luaDocDecorationTypeApplier';
import DecorationTypeApplierCollection from './decorationType/decorationTypeApplierCollection';
import SignatureHelpSourceMerger from './signatureHelpSourceMerger/signatureHelpSourceMerger';
import LuaDocSignatureHelpSource from './signatureHelpSource/luaDocSignatureHelpSource';
import SCARDocSignatureHelpSource from './signatureHelpSource/scarDocSignatureHelpSource';

const LUA_PARSER_OPTIONS: ILuaParserOptions  = {
	comments: false,
	locations: true,
	ranges: true
}

let diagnosticProvider: DiagnosticProvider;
let currentDocumentCompletionItemSource = new DocumentCompletionItemSource();
let scarDocCompletionItemSource: ScarDocCompletionItemSource;
let luaDocCompletionItemSource: LuaDocCompletionItemSource;
let luaConstsAutoCompletionItemSource: LuaConstsAutoCompletionItemSource;
let decorationTypeAppliers = new DecorationTypeApplierCollection();
let signatureHelpSourceMerger = new SignatureHelpSourceMerger();

export function activate(context: vscode.ExtensionContext) 
{
    diagnosticProvider = new DiagnosticProvider(new LuaParser(LUA_PARSER_OPTIONS), languages.createDiagnosticCollection());

    let completionItemMerger = new CompletionItemMerger();
    
    luaDocCompletionItemSource = new LuaDocCompletionItemSource(path.join(__dirname, '../../data/luadoc.json'));
    scarDocCompletionItemSource = new ScarDocCompletionItemSource(path.join(__dirname, '../../data/scardoc.json'));
    luaConstsAutoCompletionItemSource = new LuaConstsAutoCompletionItemSource(path.join(__dirname, '../../data/luaconstsauto.scar'));

    decorationTypeAppliers.addApplier(new SCARDocDecorationTypeApplier(scarDocCompletionItemSource, diagnosticProvider.luaParser));
    decorationTypeAppliers.addApplier(new LuaConstsAutoDecorationTypeApplier(luaConstsAutoCompletionItemSource, diagnosticProvider.luaParser));
    decorationTypeAppliers.addApplier(new LuaDocDecorationTypeApplier(luaDocCompletionItemSource, diagnosticProvider.luaParser));

    let completionItemSources = [
        completionItemMerger.addStaticSource(luaDocCompletionItemSource),
        completionItemMerger.addStaticSource(scarDocCompletionItemSource),
        completionItemMerger.addStaticSource(luaConstsAutoCompletionItemSource),
        completionItemMerger.addActiveSource(currentDocumentCompletionItemSource),
    ];

    Promise.all(completionItemSources).then((values: any[]) =>
    {
        let signatureHelpSources = [
            signatureHelpSourceMerger.addStaticSource(new LuaDocSignatureHelpSource(luaDocCompletionItemSource)),
            signatureHelpSourceMerger.addStaticSource(new SCARDocSignatureHelpSource(scarDocCompletionItemSource))
        ];

        Promise.all(signatureHelpSources).then(() => 
        {
            let finder = signatureHelpSourceMerger;
            console.log('signature help provider ready to serve.');
        });

        let completionItemProvider = vscode.languages.registerCompletionItemProvider('scar', new CompletionItemProvider(completionItemMerger));
        context.subscriptions.push(completionItemProvider);
        
        workspace.onDidSaveTextDocument((textDocument: TextDocument) =>
        {
            currentDocumentCompletionItemSource.update(textDocument);
        });

        workspace.onDidChangeTextDocument((e) => 
        {
            if (e.document.languageId == 'scar')
            {
                diagnosticProvider.update(e.document);
                decorationTypeAppliers.update(window.activeTextEditor);
            }
        });

        window.onDidChangeActiveTextEditor((e) => 
        {
            if (e.document.languageId == 'scar')
            {
                diagnosticProvider.update(e.document);
                currentDocumentCompletionItemSource.update(e.document);
                decorationTypeAppliers.update(e);
            }
        });

        // Kick-off
        if (window.activeTextEditor !== undefined && window.activeTextEditor.document.languageId == 'scar')
        {
            let textEditor = window.activeTextEditor;

            currentDocumentCompletionItemSource.update(textEditor.document);
            diagnosticProvider.update(textEditor.document);
            decorationTypeAppliers.update(textEditor);
        }
    });
}

export function deactivate() 
{
    
}