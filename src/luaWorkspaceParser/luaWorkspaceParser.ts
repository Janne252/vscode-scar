'use strict';

import * as fs from 'fs';
import * as path from 'path';

import {workspace, CompletionItem} from 'vscode';

import LuaParser, {ILuaParserOptions, ILuaParserFunctionDeclaration, ILuaParserFunctionDeclarationParameter, ILuaParserAstRootNode, ILuaParserCommentNode} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/luaParserCallExpression';
import ObjectIterator from '../helper/objectIterator';
import {DumpJSON, ILuaFunctionDefinitionParameter} from '../scar';
import FSHelpers from '../helper/fsHelpers';
import StringHelper from '../helper/string';
import WorkspaceLuaFunctionDocumentation from './workspaceLuaFunctionDocumentation';
import WorkspaceLuaFunctionInformation from './workspaceLuaFunctionInformation';

import WorkspaceSignatureHelpSource from '../itemSourceMerger/source/workspaceSignatureHelp';
import WorkspaceCompletionItemSource from '../itemSourceMerger/source/workspaceCompletionItem';

export default class LuaWorkspaceParser
{
    protected rootpath: string;
    protected luaParser: LuaParser;
    protected files: string[];

    protected disallowIntermediateCacheFiles: boolean;
    protected allowedExtensions: string[];
    protected disallowedFiles: string[];
    protected disallowedSubExtensions: string[];
    protected disallowedFilesRegex: RegExp;

    protected log: string[];

    protected _fileCount: number = 0;
    public get fileCount(): number
    {
        return this._fileCount;
    }

    protected _parsedFileCount: number = 0;
    public get parsedFileCount(): number
    {
        return this._parsedFileCount;
    }

    protected _completionItemSource: WorkspaceCompletionItemSource;
    public get completionItemSource(): WorkspaceCompletionItemSource
    {
        return this._completionItemSource;
    }
    
    protected _signatureHelpSource: WorkspaceSignatureHelpSource;
    public get signatureHelpSource(): WorkspaceSignatureHelpSource
    {
        return this._signatureHelpSource;
    }

    constructor(rootpath: string, LuaParser: LuaParser)
    {
        this.rootpath = rootpath;
        this.luaParser = LuaParser;
        this.files = [];
        this._completionItemSource = new WorkspaceCompletionItemSource();
        this._signatureHelpSource = new WorkspaceSignatureHelpSource();
        this.disallowIntermediateCacheFiles = <boolean>workspace.getConfiguration('scar').get('ignoreIntermediateCacheFiles');
        this.allowedExtensions = <string[]>workspace.getConfiguration('scar').get('extensions');
        this.disallowedFiles = <string[]>workspace.getConfiguration('scar').get('ignoreFiles');
        this.disallowedSubExtensions = <string[]>workspace.getConfiguration('scar').get('ignoreFileSubExtensions');

        let disallowedFilesRegexString = <string>workspace.getConfiguration('scar').get('ignoreFilesRegex');

        if (disallowedFilesRegexString.length > 0)
        {
            this.disallowedFilesRegex = new RegExp(disallowedFilesRegexString);
        }

        for(let i = 0; i < this.allowedExtensions.length; i++)
        {
            this.allowedExtensions[i] = this.allowedExtensions[i].toLowerCase();
        }         
        
        for(let i = 0; i < this.disallowedFiles.length; i++)
        {
            this.disallowedFiles[i] = this.disallowedFiles[i].toLowerCase();
        }        
        
        for(let i = 0; i < this.disallowedSubExtensions.length; i++)
        {
            this.disallowedSubExtensions[i] = this.disallowedSubExtensions[i].toLowerCase();
        }

        this.log = [];
    }

    public reload(): Thenable<void>
    {
        this._completionItemSource.clear();
        this._signatureHelpSource.clear();
        
        return this.load();
    }

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

    public exists(filepath: string): boolean
    {
        filepath = filepath.toLowerCase();

        return this.files.indexOf(filepath) != -1;
    }

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
        if 
        (
            (!this.disallowIntermediateCacheFiles || filepath.indexOf('intermediate cache') == -1) &&
            this.allowedExtensions.indexOf(ext) !== -1 &&
            this.disallowedFiles.indexOf(filepath) == -1 &&
            StringHelper.containsAny(filepath, this.disallowedSubExtensions) == false && 
            (!this.disallowedFilesRegex || this.disallowedFilesRegex.test(filepath) == false)
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

    protected parseAst(filepath: string, ast: ILuaParserAstRootNode): void
    {
        ObjectIterator.each(ast, (key, node: ILuaParserFunctionDeclaration) =>
        {
            if (node !== null && node.type === 'FunctionDeclaration' && node.identifier != null)
            {
                let info = new WorkspaceLuaFunctionInformation(filepath, ast, node);

                //self._completionItemSource.addCompletionItem(new WorkspaceLuaFunctionCompletionItem(info.name, info.signature, info.description, filepath));
                //self._signatureHelpSource.addSignatureHelpItem(new WorkspaceLuaFunctionSignatureHelp(info.name, info.signature, info.description, info.parameters, filepath));

                this._completionItemSource.parserAddItem(info);
                this._signatureHelpSource.parserAddItem(info);
            }
        });
    }

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
