'use strict';

import * as fs from 'fs';
import * as path from 'path';
import {ILuaParserOptions, ILuaParserFunctionDeclaration, ILuaParserFunctionDeclarationParameter, ILuaParserAstRootNode, ILuaParserCommentNode} from 'luaparse';
import {workspace, CompletionItem} from 'vscode';

import LuaParser from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/luaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {DumpJSON, ILuaFunctionDefinitionParameter} from '../scar';
import FSHelpers from '../helper/fsHelpers';
import StringHelper from '../helper/string';
import WorkspaceLuaFunctionDocumentation from './workspaceLuaFunctionDocumentation';
import WorkspaceLuaFunctionInformation from './workspaceLuaFunctionInformation';

import WorkspaceSignatureHelpSource from '../itemSources/workspaceSignatureHelp';
import WorkspaceCompletionItemSource from '../itemSources/workspaceCompletionItem';
import WorkspaceParserConfig from './parserConfig';
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
    protected rootpath: string;
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
    public get signatureHelpSource(): WorkspaceSignatureHelpSource
    {
        return this._signatureHelpSource;
    }
    /**
     * Creates a new instance of WorkspaceParser.
     * @param rootpath The root directory path of the workspace to parse.
     * @param luaParser The lua parser instance used to parse the files.
     */
    constructor(rootpath: string, luaParser: LuaParser)
    {
        this.rootpath = rootpath;
        this.luaParser = luaParser;
        this.files = [];
        this._completionItemSource = new WorkspaceCompletionItemSource();
        this._signatureHelpSource = new WorkspaceSignatureHelpSource();

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

            let filepaths = FSHelpers.readDirSyncRecursive(this.rootpath);
            //console.log(filepaths.join('\n'));

            console.log(`Starting to process ${filepaths.length} files. `);
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
                        console.log(`Checked ${this.fileCount} files, of which ${this.parsedFileCount} were parsed. Log:`);

                        //console.log(this.log.join('\n'));
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
    public registerNewFile(filepath: string): Thenable<boolean>
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
    protected parseAst(filepath: string, ast: ILuaParserAstRootNode): void
    {
        ObjectIterator.each(ast, (key, node: ILuaParserFunctionDeclaration) =>
        {
            if (node !== null && node.type === 'FunctionDeclaration' && node.identifier != null)
            {
                let info = new WorkspaceLuaFunctionInformation(this.config, filepath, ast, node);

                this._completionItemSource.parserAddItem(info);
                this._signatureHelpSource.parserAddItem(info);
            }
        });
    }
    /**
     * Re-parses a file.
     * @param filepath The path to the file to re-parse.
     */
    public reparseFile(filepath: string): Thenable<boolean>
    {
        let removedCompletionItems = 0;
        let removedSignatureHelpItems = 0;

        this._completionItemSource.removeItems((item): boolean => 
        {
            if (item.filepath == filepath)
            {
                removedCompletionItems++;
                return true;
            }
            
            return false;
        });
        
        this._signatureHelpSource.removeItems((item): boolean => 
        {
            if (item.filepath == filepath)
            {
                removedSignatureHelpItems++;
                return true;
            }
            
            return false;
        });

        console.log(`reparsing file "${filepath}". Removed completion items: ${removedCompletionItems}, removed signatureHelpItems: ${removedSignatureHelpItems}`);
        return this.parseFile(filepath);
    }
}
