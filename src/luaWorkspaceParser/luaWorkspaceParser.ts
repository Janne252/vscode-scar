'use strict';

import * as fs from 'fs';
import * as path from 'path';

import {workspace} from 'vscode';

import LuaParser, {ILuaParserOptions, ILuaParserFunctionDeclaration, ILuaParserFunctionDeclarationParameter, ILuaParserAstRootNode, ILuaParserCommentNode} from '../luaParser/luaParser';
import LuaParserCallExpression from '../luaParser/luaParserCallExpression';
import WorkspaceCompletionItemSource from '../completionItemSource/workspaceCompletionItemSource';
import WorkspaceSignatureHelpSource from '../signatureHelpSource/workspaceSignatureHelpSource';
import ObjectIterator from '../helper/objectIterator';
import {DumpJSON, ILuaFunctionDefinitionParameter} from '../scar';
import WorkspaceLuaFunctionCompletionItem from '../completionItem/workspaceLuaFunctionCompletionItem';
import WorkspaceLuaFunctionSignatureHelp from '../signatureHelp/workspaceLuaFunctionSignatureHelp';
import FSHelpers from '../helper/fsHelpers';
import StringHelper from '../helper/string';
import WorkspaceLuaFunctionDocumentation from './workspaceLuaFunctionDocumentation';

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

    public registerNewFile(filepath: string): Thenable<boolean>
    {
        return new Promise((resolve, reject) => 
        {
            filepath = filepath.toLowerCase();

            let ext = path.extname(filepath);
            //console.log('disallowed files: ' + this.disallowedFiles.join(', ') + ' | check against ' + filepath);
            if 
            (
                (!this.disallowIntermediateCacheFiles || filepath.indexOf('intermediate cache') == -1) &&
                this.allowedExtensions.indexOf(ext) !== -1 &&
                this.disallowedFiles.indexOf(filepath) == -1 &&
                StringHelper.containsAny(filepath, this.disallowedSubExtensions) == false && 
                (!this.disallowedFilesRegex || this.disallowedFilesRegex.test(filepath) == false)
            )
            {
                this.files.push(filepath);

                this.parseFile(filepath).then((valid: boolean) => 
                {
                    resolve(valid);
                });
            }
            else
            {
                this.log.push(`Skipping file "${filepath}", extension "${ext}" not allowed in the configuration or is a cached file.`);
                resolve(false);
            }
        });
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
        let self = this;

        ObjectIterator.each(ast, function(key, node: ILuaParserFunctionDeclaration)
        {
            if (node !== null && node.type === 'FunctionDeclaration' && node.identifier != null)
            {
                let parameters: ILuaFunctionDefinitionParameter[] = [];
                let paramNames: string[] = [];

                let param: ILuaParserFunctionDeclarationParameter;
                for(let i = 0; i < node.parameters.length; i++)
                {
                    param = node.parameters[i];
                    parameters.push({
                        name: param.name,
                        type: 'any',
                        optional: false
                    });
                    paramNames.push(param.name);
                }

                let signature: string = '';
                let name: string = '';
                try
                {
                    let description = `File: ${filepath}, line ${node.loc.start.line + 1}`;

                    if (ast.comments !== undefined)
                    {
                        let comments = ast.comments;
                        let targetLine = node.loc.start.line - 1; // one line above the function declaration

                        let commentsAboveFunction: ILuaParserCommentNode[] = [];
                        let comment: ILuaParserCommentNode;
                        // Lua parser ast tree contains comments in the order of occurrance. 
                        // Iterate over the comments in reversed order and see how many comments can be found above the function delcaration.
                        for(let i = comments.length - 1; i >= 0; i--)
                        {
                            comment = comments[i];

                            if (comment.loc.start.line == targetLine)
                            {
                                commentsAboveFunction.push(comment);
                                targetLine--;
                            }
                        }

                        if (commentsAboveFunction.length > 0)
                        {
                            let doc = new WorkspaceLuaFunctionDocumentation(commentsAboveFunction);

                            for(let parameter of parameters)
                            {
                                if (doc.parameters[parameter.name])
                                {
                                    parameter.description = doc.parameters[parameter.name].description;
                                }
                            }

                            description = `${doc.description} ${doc.returns} ${description}`;
                        }
                    }
                    name = node.identifier.name;
                    signature = `${name}(${paramNames.join(', ')})`;


                    self._completionItemSource.addCompletionItem(new WorkspaceLuaFunctionCompletionItem(name, signature, description, filepath));
                    self._signatureHelpSource.addSignatureHelpItem(new WorkspaceLuaFunctionSignatureHelp(name, signature, description, parameters, filepath));
                }
                catch(error)
                {
                    //console.log(JSON.stringify(node));
                }
            }
        });
    }

    public reparseFile(filepath: string): void
    {
        let completionItems = <WorkspaceLuaFunctionCompletionItem[]>this._completionItemSource.getCompletionItems();
        let signatureHelpitems = <WorkspaceLuaFunctionSignatureHelp[]>this._signatureHelpSource.getSignatureHelpItems();

        let removedCompletionItems = 0;
        let removedSignatureHelpItems = 0;

        for(let item of completionItems)
        {
            if (item.source == filepath)
            {
                this._completionItemSource.removeCompletionItem(item);
                removedCompletionItems++;
            }
        }
        
        for(let item of signatureHelpitems)
        {
            if (item.source == filepath)
            {
                this._signatureHelpSource.removeSignatureHelpItem(item);
                removedSignatureHelpItems++;
            }
        }

        console.log(`reparsing file "${filepath}". Removed completion items: ${removedCompletionItems}, removed signatureHelpItems: ${removedSignatureHelpItems}`);
        this.parseFile(filepath);
    }
}
