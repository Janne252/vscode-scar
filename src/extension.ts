'use strict';

import * as vscode from 'vscode';
import {ILuaParseOptions, ILuaParseError, ILuaParseCallExpressionNode} from 'luaparse';
import {window, workspace, languages, TextDocument, DiagnosticCollection, Range, Position, TextEditor, commands, WorkspaceEdit} from 'vscode';
import * as path from 'path';
import {ILuaFunctionDefinition} from './scar';
import CompletionItemProvider from './completionItemProvider';
import LuaParser from './luaParser/luaParser';
import LuaParserCallExpression from './luaParser/LuaParserCallExpression';
import LuaParserDiagnostic from './diagnostic/LuaParserDiagnostic';
import DiagnosticProvider from './diagnosticProvider';
import SCARDocDecorationTypeApplier from './decorationType/scarDocDecorationTypeApplier';
import LuaConstsAutoDecorationTypeApplier from './decorationType/luaConstsAutoDecorationTypeApplier';
import LuaDocDecorationTypeApplier from './decorationType/luaDocDecorationTypeApplier';
import WorkspaceDecorationTypeApplier from './decorationType/workspaceDecorationTypeApplier';
import DecorationTypeApplierCollection from './decorationType/decorationTypeApplierCollection';

import SignatureHelpProvider from './signatureHelpProvider';
import LuaWorkspaceParser from './luaWorkspaceParser/parser';
import {SCARDocParser, LuaDocParser, LuaConstsAutoParser, DumpJSON} from './scar';

import ItemSourceMerger from './itemSourceMerger/merger';
import {ICompletionItem} from './itemSources/completionItem';
import {ISignatureHelp} from './itemSources/signatureHelp';
import {SCARDocCompletionItemSource, LuaDocCompletionItemSource} from './itemSources/luaDocCompletionItem';
import LuaConstsAutoCompletionItemSource from './itemSources/luaConstsAutoCompletionItem';
import DocumentCompletionItemSource from './itemSources/documentCompletionItem';
import WorkspaceCompletionItemSource from './itemSources/workspaceCompletionItem';
import {SCARDocSignatureHelpSource, LuaDocSignatureHelpSource} from './itemSources/luaDocSignatureHelp';
import QuickPickInsertCommand from './command/quickPickInsertCommand';

const LUA_PARSER_OPTIONS: ILuaParseOptions  = {
    comments: true,
    locations: true,
    ranges: true
}

let diagnosticProvider: DiagnosticProvider;
let completionItemMerger = new ItemSourceMerger<ICompletionItem>();
let scarDocParser: SCARDocParser;
let luaDocParser: LuaDocParser;
let luaConstsAutoParser: LuaConstsAutoParser;
let documentCompletionItemSource: DocumentCompletionItemSource;

let decorationTypeAppliers = new DecorationTypeApplierCollection('scar');
let signatureHelpSourceMerger = new ItemSourceMerger<ISignatureHelp>();
let workspaceParser: LuaWorkspaceParser;

export function activate(context: vscode.ExtensionContext) 
{
    scarDocParser = new SCARDocParser(path.join(__dirname, '../../data/scardoc.json'));
    luaDocParser = new LuaDocParser(path.join(__dirname, '../../data/luadoc.json'));
    luaConstsAutoParser = new LuaConstsAutoParser(path.join(__dirname, '../../data/luaconstsauto.scar'));
    documentCompletionItemSource = new DocumentCompletionItemSource();
    documentCompletionItemSource.startAutoUpdate();
    
    diagnosticProvider = new DiagnosticProvider(new LuaParser(LUA_PARSER_OPTIONS), languages.createDiagnosticCollection());
    workspaceParser = new LuaWorkspaceParser(workspace.rootPath, diagnosticProvider.luaParser);

    let parsers = [
        scarDocParser.load(),
        luaDocParser.load(),
        luaConstsAutoParser.load()
    ]

    Promise.all(parsers).then(() => 
    {
        decorationTypeAppliers.addApplier(new SCARDocDecorationTypeApplier(scarDocParser, diagnosticProvider.luaParser));
        decorationTypeAppliers.addApplier(new LuaConstsAutoDecorationTypeApplier(luaConstsAutoParser, diagnosticProvider.luaParser));
        decorationTypeAppliers.addApplier(new LuaDocDecorationTypeApplier(luaDocParser, diagnosticProvider.luaParser));

        completionItemMerger.addStaticSource(new SCARDocCompletionItemSource(scarDocParser));
        completionItemMerger.addStaticSource(new LuaDocCompletionItemSource(luaDocParser));
        completionItemMerger.addStaticSource(new LuaConstsAutoCompletionItemSource(luaConstsAutoParser));
        completionItemMerger.addActiveSource(documentCompletionItemSource);

        signatureHelpSourceMerger.addStaticSource(new SCARDocSignatureHelpSource(scarDocParser));
        signatureHelpSourceMerger.addStaticSource(new LuaDocSignatureHelpSource(luaDocParser));

        context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scar', new CompletionItemProvider(completionItemMerger)));

        workspaceParser.load().then(() => 
        {
            signatureHelpSourceMerger.addActiveSource(workspaceParser.signatureHelpSource);
            completionItemMerger.addActiveSource(workspaceParser.completionItemSource);

            context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('scar', new SignatureHelpProvider(signatureHelpSourceMerger, diagnosticProvider.luaParser), '('));

            decorationTypeAppliers.addApplier(new WorkspaceDecorationTypeApplier(workspaceParser.completionItemSource, diagnosticProvider.luaParser));

            decorationTypeAppliers.update(window.activeTextEditor);
        });

        workspace.onDidSaveTextDocument((textDocument: TextDocument) =>
        {
            documentCompletionItemSource.update(textDocument);

            workspaceParser.resolveWorkspaceFileChanged(textDocument.fileName).then((success) => 
            {
                if (success)
                {
                    decorationTypeAppliers.update(window.activeTextEditor);
                }
            });
        });

        workspace.onDidChangeTextDocument((textEditor) => 
        {
            if (textEditor.document.languageId == 'scar')
            {
                documentCompletionItemSource.shouldUpdate = true;
                diagnosticProvider.update(textEditor.document);
            }

            //decorationTypeAppliers.update(window.activeTextEditor);
        });

        window.onDidChangeActiveTextEditor((textEditor) => 
        {
            if (textEditor.document.languageId == 'scar')
            {
                diagnosticProvider.update(textEditor.document);
                documentCompletionItemSource.update(textEditor.document);
            }

            decorationTypeAppliers.update(textEditor);
        });

        context.subscriptions.push(new QuickPickInsertCommand('scar.findBlueprint', luaConstsAutoParser.blueprints));

        context.subscriptions.push(commands.registerCommand('scar.reloadWorkspace', (args: any[]) =>
        {
            workspaceParser.reload().then(() => 
            {
                decorationTypeAppliers.update(window.activeTextEditor);
                console.log('Workspace reloaded!');
            });
        }));

        context.subscriptions.push(commands.registerCommand('scar.dumpAst', (args: any[]) =>
        {
            DumpJSON(diagnosticProvider.luaParser.ast);
        }));

        // Kick-off
        if (window.activeTextEditor !== undefined && window.activeTextEditor.document.languageId == 'scar')
        {
            diagnosticProvider.update(window.activeTextEditor.document);
        } 
    });
}

export function deactivate() 
{
    
}