'use strict';

import * as vscode from 'vscode';
import {window, workspace, languages, TextDocument, DiagnosticCollection, Range, Position, TextEditor, commands, WorkspaceEdit} from 'vscode';
import * as path from 'path';
import {ILuaFunctionDefinition} from './scar';
import CompletionItemProvider from './completionItemProvider';
import LuaParser, {ILuaParserOptions, ILuaParserError, ILuaParserCallExpression} from './luaParser/luaParser';
import LuaParserCallExpression from './luaParser/LuaParserCallExpression';
import LuaParserDiagnostic from './diagnostic/LuaParserDiagnostic';
import DiagnosticProvider from './diagnosticProvider';
import ObjectIterator from './helper/objectIterator';
import SCARDocDecorationTypeApplier from './decorationType/scarDocDecorationTypeApplier';
import LuaConstsAutoDecorationTypeApplier from './decorationType/luaConstsAutoDecorationTypeApplier';
import LuaDocDecorationTypeApplier from './decorationType/luaDocDecorationTypeApplier';
import WorkspaceDecorationTypeApplier from './decorationType/workspaceDecorationTypeApplier';
import DecorationTypeApplierCollection from './decorationType/decorationTypeApplierCollection';

import SignatureHelpProvider from './signatureHelpProvider';
import LuaWorkspaceParser from './luaWorkspaceParser/luaWorkspaceParser';
import {SCARDocParser, LuaDocParser, LuaConstsAutoParser, DumpJSON} from './scar';

import ItemSourceMerger from './itemSourceMerger/itemSourceMerger';
import {ISourceCompletionItem} from './itemSourceMerger/item/completionItem';
import {ISourceSignatureHelp} from './itemSourceMerger/item/signatureHelp';
import SCarDocCompletionItemSource from './itemSourceMerger/source/scarDocCompletionItem';
import LuaDocCompletionItemSource from './itemSourceMerger/source/luaDocCompletionItem';
import LuaConstsAutoCompletionItemSource from './itemSourceMerger/source/luaConstsAutoCompletionItem';
import DocumentCompletionItemSource from './itemSourceMerger/source/documentCompletionItem';
import WorkspaceCompletionItemSource from './itemSourceMerger/source/workspaceCompletionItem';

import {SCARDocSignatureHelpSource, LuaDocSignatureHelpSource} from './itemSourceMerger/source/luaDocSignatureHelp';

const LUA_PARSER_OPTIONS: ILuaParserOptions  = {
	comments: true,
	locations: true,
	ranges: true
}

let diagnosticProvider: DiagnosticProvider;
let completionItemMerger = new ItemSourceMerger<ISourceCompletionItem>();
let scarDocParser: SCARDocParser;
let luaDocParser: LuaDocParser;
let luaConstsAutoParser: LuaConstsAutoParser;
let documentCompletionItemSource: DocumentCompletionItemSource;

let decorationTypeAppliers = new DecorationTypeApplierCollection('scar');
let signatureHelpSourceMerger = new ItemSourceMerger<ISourceSignatureHelp>();
let workspaceParser: LuaWorkspaceParser;

export function activate(context: vscode.ExtensionContext) 
{
    scarDocParser = new SCARDocParser(path.join(__dirname, '../../data/scardoc.json'));
    luaDocParser = new LuaDocParser(path.join(__dirname, '../../data/luadoc.json'));
    luaConstsAutoParser = new LuaConstsAutoParser(path.join(__dirname, '../../data/luaconstsauto.scar'));
    documentCompletionItemSource = new DocumentCompletionItemSource();

    let shouldUpdateCurrentDocumentCompletionItemSource = false;
    
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

        completionItemMerger.addStaticSource(new SCarDocCompletionItemSource(scarDocParser));
        completionItemMerger.addStaticSource(new LuaDocCompletionItemSource(luaDocParser));
        completionItemMerger.addStaticSource(new LuaConstsAutoCompletionItemSource(luaConstsAutoParser));
        completionItemMerger.addActiveSource(documentCompletionItemSource);

        signatureHelpSourceMerger.addStaticSource(new SCARDocSignatureHelpSource(scarDocParser));
        signatureHelpSourceMerger.addStaticSource(new LuaDocSignatureHelpSource(luaDocParser));

        context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scar', new CompletionItemProvider(completionItemMerger)));

        workspaceParser.load().then(() => 
        {
            signatureHelpSourceMerger.addActiveSource(workspaceParser.signatureHelpSource);
            context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('scar', new SignatureHelpProvider(signatureHelpSourceMerger, diagnosticProvider.luaParser), '('));

            decorationTypeAppliers.addApplier(new WorkspaceDecorationTypeApplier(workspaceParser.completionItemSource, diagnosticProvider.luaParser));

            decorationTypeAppliers.update(window.activeTextEditor);
        });

        workspace.onDidSaveTextDocument((textDocument: TextDocument) =>
        {
            documentCompletionItemSource.update(textDocument);

            let fileParsing: Thenable<boolean>;

            if (workspaceParser.exists(textDocument.fileName))
            {
                fileParsing = workspaceParser.reparseFile(textDocument.fileName);
            }
            else
            {
                fileParsing = workspaceParser.registerNewFile(textDocument.fileName);
            }

            fileParsing.then((success) => 
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
                shouldUpdateCurrentDocumentCompletionItemSource = true;
                diagnosticProvider.update(textEditor.document);
            }

            decorationTypeAppliers.update(window.activeTextEditor);
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

        context.subscriptions.push(commands.registerCommand('scar.findBlueprint', (args: any[]) => 
        {
            let result = window.showQuickPick(luaConstsAutoParser.blueprints);
            result.then((value: string) =>
            {
                let textEditor = window.activeTextEditor;
                if (textEditor)
                {
                    textEditor.edit((editBuilder: vscode.TextEditorEdit) => 
                    {
                        editBuilder.insert(textEditor.selection.start, value); 
                    });
                }
            }); 
        }));

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

        setInterval(() => 
        {
            if (shouldUpdateCurrentDocumentCompletionItemSource && window.activeTextEditor !== undefined && window.activeTextEditor.document.languageId == 'scar')
            {
                shouldUpdateCurrentDocumentCompletionItemSource = false;
                documentCompletionItemSource.update(window.activeTextEditor.document);
            }
        }, 1000);
    });
}

export function deactivate() 
{
    
}