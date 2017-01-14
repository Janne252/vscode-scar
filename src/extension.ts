'use strict';

import * as vscode from 'vscode';
import {window, workspace, languages, TextDocument, DiagnosticCollection, Range, Position, TextEditor, commands, WorkspaceEdit} from 'vscode';
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
import WorkspaceDecorationTypeApplier from './decorationType/workspaceDecorationTypeApplier';
import DecorationTypeApplierCollection from './decorationType/decorationTypeApplierCollection';
import SignatureHelpSourceMerger from './signatureHelpSourceMerger/signatureHelpSourceMerger';
import LuaDocSignatureHelpSource from './signatureHelpSource/luaDocSignatureHelpSource';
import SCARDocSignatureHelpSource from './signatureHelpSource/scarDocSignatureHelpSource';
import LuaFunctionSignatureHelp from './signatureHelp/luaFunctionSignatureHelp';
import SignatureHelpProvider from './signatureHelpProvider';
import LuaWorkspaceParser from './luaWorkspaceParser/luaWorkspaceParser';
import {DumpJSON} from './scar';

const LUA_PARSER_OPTIONS: ILuaParserOptions  = {
	comments: true,
	locations: true,
	ranges: true
}

let diagnosticProvider: DiagnosticProvider;
let completionItemMerger = new CompletionItemMerger();
let currentDocumentCompletionItemSource = new DocumentCompletionItemSource();
let scarDocCompletionItemSource: ScarDocCompletionItemSource;
let luaDocCompletionItemSource: LuaDocCompletionItemSource;
let luaConstsAutoCompletionItemSource: LuaConstsAutoCompletionItemSource;
let decorationTypeAppliers = new DecorationTypeApplierCollection('scar');
let signatureHelpSourceMerger = new SignatureHelpSourceMerger();
let workspaceParser: LuaWorkspaceParser;

export function activate(context: vscode.ExtensionContext) 
{
    let shouldUpdateCurrentDocumentCompletionItemSource = false;
    
    diagnosticProvider = new DiagnosticProvider(new LuaParser(LUA_PARSER_OPTIONS), languages.createDiagnosticCollection());

    workspaceParser = new LuaWorkspaceParser(workspace.rootPath, diagnosticProvider.luaParser);
    
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
        context.subscriptions.push(vscode.languages.registerCompletionItemProvider('scar', new CompletionItemProvider(completionItemMerger)));
        
        workspaceParser.load().then(() => 
        {
            completionItemMerger.addActiveSource(workspaceParser.completionItemSource);
            signatureHelpSourceMerger.addActiveSource(workspaceParser.signatureHelpSource);

            decorationTypeAppliers.addApplier(new WorkspaceDecorationTypeApplier(workspaceParser.completionItemSource, diagnosticProvider.luaParser));

            decorationTypeAppliers.update(window.activeTextEditor);
        });

        let signatureHelpSources = [
            signatureHelpSourceMerger.addStaticSource(new LuaDocSignatureHelpSource(luaDocCompletionItemSource)),
            signatureHelpSourceMerger.addStaticSource(new SCARDocSignatureHelpSource(scarDocCompletionItemSource))
        ];

        Promise.all(signatureHelpSources).then(() => 
        {
            context.subscriptions.push(vscode.languages.registerSignatureHelpProvider('scar', new SignatureHelpProvider(signatureHelpSourceMerger, diagnosticProvider.luaParser), '('));
        });

        workspace.onDidSaveTextDocument((textDocument: TextDocument) =>
        {
            currentDocumentCompletionItemSource.update(textDocument);

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
                currentDocumentCompletionItemSource.update(textEditor.document);
            }

            decorationTypeAppliers.update(textEditor);
        });

        context.subscriptions.push(commands.registerCommand('scar.findBlueprint', (args: any[]) => 
        {
            let result = window.showQuickPick(luaConstsAutoCompletionItemSource.getRawList());
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
                currentDocumentCompletionItemSource.update(window.activeTextEditor.document);
            }
        }, 1000);
    });
}

export function deactivate() 
{
    
}