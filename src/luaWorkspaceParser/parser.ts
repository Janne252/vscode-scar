'use strict';

import * as fs from 'fs';
import * as path from 'path';
import {ILuaParseOptions, ILuaParseFunctionDeclaration, ILuaParseFunctionDeclarationParameter, ILuaParseAstRootNode, ILuaParseCommentNode} from 'luaparse';
import {workspace, CompletionItem, CompletionItemKind} from 'vscode';

import LuaParser from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/callExpression';
import ObjectIterator from '../helper/objectIterator';
import {DumpJSON, ILuaFunctionDefinitionParameter} from '../scar';
import FSHelpers from '../helper/fsHelpers';
import StringHelper from '../helper/string';
import WorkspaceLuaFunctionDocumentation from './luaFunctionDocumentation';
import WorkspaceLuaFunctionInformation from './luaFunctionInformation';

import WorkspaceSignatureHelpSource from '../itemSources/workspaceSignatureHelp';
import WorkspaceCompletionItemSource from '../itemSources/workspaceCompletionItem';
import WorkspaceHoverSource from '../itemSources/workspaceHover';

import WorkspaceParserConfig from './parserConfig';

import {IWorkspaceCompletionItem} from '../itemSources/completionItem';
import {IWorkspaceSignatureHelp} from '../itemSources/signatureHelp';
import {IWorkspaceHover} from '../itemSources/hover';

/**
 * Represents a workspace lua parser.
 */
export default class LuaWorkspaceParser
{
    /**
     * Config read from workspace/user settings.
     */
    public config: WorkspaceParserConfig;
    /**
     * Root directory path of the workspace.
     */
    protected _rootpath: string;
    /**
     * Lua parser instance.
     */
    protected luaParser: LuaParser;
    /**
     * Registered files from the workspace.
     */
    protected files: string[];
    /**
     * Internal log used to report reasons why a file was not parsed.
     */
    protected log: string[];
    /**
     * Total number of files in the workspace.
     */
    protected _fileCount: number = 0;
    /**
     * Total number of files in the workspace.
     */
    public get fileCount(): number
    {
        return this._fileCount;
    }
    /**
     * Root directory path of the workspace.
     */
    public get rootpath(): string
    {
        return this._rootpath;
    }
    /**
     * Total number of parsed files.
     */
    protected _parsedFileCount: number = 0;
    /**
     * Total number of parsed files.
     */
    public get parsedFileCount(): number
    {
        return this._parsedFileCount;
    }
    /**
     * CompletionItems parsed by the WorkspaceParser.
     */
    protected _completionItemSource: WorkspaceCompletionItemSource;
    /**
     * CompletionItems parsed by the WorkspaceParser.
     */
    public get completionItemSource(): WorkspaceCompletionItemSource
    {
        return this._completionItemSource;
    }
    /**
     * SignatureHelp items parsed by the WorkspaceParser.
     */
    protected _signatureHelpSource: WorkspaceSignatureHelpSource;
    /**
     * SignatureHelp items parsed by the WorkspaceParser.
     */
    public get signatureHelpSource(): WorkspaceSignatureHelpSource
    {
        return this._signatureHelpSource;
    }
    protected _hoverSource: WorkspaceHoverSource;
    public get hoverSource(): WorkspaceHoverSource
    {
        return this._hoverSource;
    }
    /**
     * Creates a new instance of WorkspaceParser.
     * @param rootpath The root directory path of the workspace to parse.
     * @param luaParser The lua parser instance used to parse the files.
     */
    constructor(rootpath: string, luaParser: LuaParser)
    {
        this._rootpath = rootpath;
        this.luaParser = luaParser;
        this.files = [];
        this._completionItemSource = new WorkspaceCompletionItemSource(rootpath);
        this._signatureHelpSource = new WorkspaceSignatureHelpSource(rootpath);
        this._hoverSource = new WorkspaceHoverSource(rootpath);

        this.config = new WorkspaceParserConfig();

        this.log = [];
    }
    /**
     * Reloads all files in the workspace and parses all the files.
     */
    public reload(): Thenable<void>
    {
        this._completionItemSource.clear();
        this._signatureHelpSource.clear();
        
        return this.load();
    }
    /**
     * Loads the workspace and parses all the files.
     */
    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            this._parsedFileCount = 0;
            this.files = [];

            let filepaths = FSHelpers.readDirSyncRecursive(this._rootpath);
            //console.log(filepaths.join('\n'));
            
            this._fileCount = filepaths.length;
            let counter: number = 0;

            for(let filepath of filepaths)
            {
                this.registerNewFile(filepath).then((valid: boolean) => 
                {
                    counter++;

                    if(valid)
                    {
                        this._parsedFileCount++;
                    }

                    if (counter == this._fileCount)
                    {
                        resolve();
                        //console.log(`Checked ${this.fileCount} files, of which ${this.parsedFileCount} were parsed. Log:`);
                    }
                });
            }
        });
    }
    /**
     * Checks if a file is known by the WorkspaceParser.
     * @param filepath The file to check.
     */
    public exists(filepath: string): boolean
    {
        filepath = filepath.toLowerCase();

        return this.files.indexOf(filepath) != -1;
    }
    /**
     * Resolves a changed file. If it's already known, the file is reloaded.
     * The file is registered as a new file otherwise.
     * @param filepath The file to resolve.
     */
    public resolveWorkspaceFileChanged(filepath: string): Thenable<boolean>
    {
        filepath = filepath.toLowerCase();

        if (this.exists(filepath))
        {
            return this.reparseFile(filepath);
        }
        else
        {
            this.registerNewFile(filepath);
        }
    }
    /**
     * Registers a new file to the WorkspaceParser.
     * @param filepath The file to register.
     */
    protected registerNewFile(filepath: string): Thenable<boolean>
    {
        filepath = filepath.toLowerCase();

        return new Promise((resolve, reject) => 
        {
            if (this.isFileAllowedToParse(filepath))
            {
                this.files.push(filepath.toLowerCase());

                this.parseFile(filepath).then((valid: boolean) => 
                {
                    resolve(valid);
                });
            }
            else
            {

                resolve(false);
            }
        });
    }
    /**
     * Internally checks if the file is allowed to be parsed.
     * @param filepath File path of the file. MUST BE ALL LOWER CASE!
     */
    protected isFileAllowedToParse(filepath: string): boolean
    {
        let ext = path.extname(filepath);
        let config = this.config;

        if 
        (
            (!config.disallowIntermediateCacheFiles || filepath.indexOf('intermediate cache') == -1) &&
            config.allowedExtensions.indexOf(ext) !== -1 &&
            config.disallowedFiles.indexOf(filepath) == -1 &&
            StringHelper.containsAny(filepath, config.disallowedSubExtensions) == false && 
            (!config.disallowedFilesRegex || config.disallowedFilesRegex.test(filepath) == false)
        )
        {
            return true;
        }
        else
        {
            this.log.push(`Skipping file "${filepath}", extension "${ext}" not allowed in the configuration or is a cached file.`);

            return false;
        }
    }
    /**
     * Parses a file and returns true if the file was parsed successfully. 
     * Returns false otherwise.
     */
    protected parseFile(filepath: string): Thenable<boolean>
    {
        return new Promise((resolve, reject) => 
        {
            fs.readFile(filepath, 'utf-8', (err, data) => 
            {
                if (err)
                {
                    this.log.push(`Skipping file "${filepath}", unable to read file: ${err.message}`);
                    resolve(false);
                }
                else
                {         
                    let ast = this.luaParser.tryParseAstFromText(data);
                    if (ast !== undefined)
                    {
                        this.parseAst(filepath, ast);
                    }

                    resolve(true);
                }
            });
        });
    }
    /**
     * Parses the LuaParser ast tree.
     * @param filepath The path to the file the ast tree originates from.
     * @param ast The AST tree.
     */
    protected parseAst(filepath: string, ast: ILuaParseAstRootNode): void
    {
        let completionItems: IWorkspaceCompletionItem[] = [];
        let signatureHelpitems: IWorkspaceSignatureHelp[] = [];
        let hovers: IWorkspaceHover[] = [];

        ObjectIterator.each(ast, (key, node: ILuaParseFunctionDeclaration) =>
        {
            if (node !== null && node.type === 'FunctionDeclaration' && node.identifier != null && node.identifier.name != null)
            {
                let info = new WorkspaceLuaFunctionInformation(this.config, filepath, ast, node);

                completionItems.push(this._completionItemSource.completionItemFromFunctionInfo(info));
                signatureHelpitems.push(this._signatureHelpSource.signatureHelpFromFunctionInfo(info));
                hovers.push(this._hoverSource.hoverFromFunctionInfo(info));
            }
        });

        this._completionItemSource.addItems(completionItems);
        this._signatureHelpSource.addItems(signatureHelpitems);
        this._hoverSource.addItems(hovers);
    }
    /**
     * Re-parses a file.
     * @param filepath The path to the file to re-parse.
     */
    protected reparseFile(filepath: string): Thenable<boolean>
    {

        let removedCompletionItems = this._completionItemSource.removeItems((item) => item.filepath == filepath);
        let removedSignatureHelpItems = this._signatureHelpSource.removeItems((item) => item.filepath == filepath);
        this._hoverSource.removeItems((item) => item.filepath == filepath);

        console.log(`reparsing file "${filepath}". Removed completion items: ${removedCompletionItems}, removed signatureHelpItems: ${removedSignatureHelpItems}`);
        return this.parseFile(filepath);
    }
}
