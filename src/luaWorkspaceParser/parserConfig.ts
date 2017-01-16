'use strict';

import {workspace} from 'vscode';

/**
 * LuaWorkspaceParser config that is loaded from the user/workspace settings.
 */
export default class WorkspaceParserConfig
{
    public disallowIntermediateCacheFiles: boolean;
    /**
     * List of allowed file extensions.
     */
    public allowedExtensions: string[];
    /**
     * List of disallowed files.
     */
    public disallowedFiles: string[];
    /**
     * List of disallowed sub file extensions.
     */
    public disallowedSubExtensions: string[];
    /**
     * Regex used to filter out disallowed files.
     */
    public disallowedFilesRegex: RegExp;
    public lDocParameterDefinition: string;
    public lDocFunctionReturnDefinition: string;

    constructor()
    {
        let config = workspace.getConfiguration('scar');

        this.lDocParameterDefinition = <string>config.get('lDocParameterDefinition');
        this.lDocFunctionReturnDefinition = <string>config.get('lDocFunctionReturnDefinition');
        this.disallowIntermediateCacheFiles = <boolean>config.get('ignoreIntermediateCacheFiles');
        this.allowedExtensions = <string[]>config.get('extensions');
        this.disallowedFiles = <string[]>config.get('ignoreFiles');
        this.disallowedSubExtensions = <string[]>config.get('ignoreFileSubExtensions');
        let disallowedFilesRegexString = <string>config.get('ignoreFilesRegex');

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
    }
}