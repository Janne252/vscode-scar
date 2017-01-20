'use strict';

import LuaWorkspaceParser from './parser';
import LuaParser from '../luaParser/luaParser';

export default class LuaWorkspaceParserCollection
{
    protected _parsers: LuaWorkspaceParser[];
    public get parsers(): ReadonlyArray<LuaWorkspaceParser>
    {
        return this._parsers;
    }

    public get count(): number
    {
        return this._parsers.length;
    }

    constructor(rootpaths: string[], luaParser: LuaParser)
    {
        this._parsers = [];

        for(let rootpath of rootpaths)
        {
            this.add(new LuaWorkspaceParser(rootpath, luaParser));
        }
    }

    public add(parser: LuaWorkspaceParser): void
    {   
        this._parsers.push(parser);
    }

    remove(parserToRemove: LuaWorkspaceParser): void
    {
        this._parsers = this._parsers.filter(parser => parser != parserToRemove);
    }

    public load(): Thenable<void>
    {
        return new Promise<void>((resolve, reject) => 
        {
            if (this._parsers.length == 0)
            {
                resolve();
            }

            let counter = 0;
            for(let parser of this._parsers)
            {
                parser.load().then(() => 
                {
                    console.log(`Loaded additional workspace: '${parser.rootpath}' (${parser.parsedFileCount} files parsed)`);
                    counter++;

                    if (counter == this.count)
                    {
                        resolve();
                    }
                });
            }
        });
    }
}