'use strict';

import * as fs from 'fs';
import * as path from 'path';

import LuaParser, {ILuaParserOptions} from '../luaParser/luaParser';

export default class LuaWorkspaceParser
{
    protected rootpath: string;
    protected luaParser: LuaParser;
    protected files: string[];

    constructor(rootpath: string, luaParserOptions: ILuaParserOptions)
    {
        this.rootpath = rootpath;
        this.luaParser = new LuaParser(luaParserOptions);
        this.files = [];
    }

    public load(): void
    {
        fs.readdir(this.rootpath, (err, files) => 
        {
            for(let file of files)
            {
                if (path.extname(file) == )
            }
        })
    }

    public registerNewFile(filepath: string): void
    {

    }

    public reparseFile(filepath: string): void
    {

    }
}
