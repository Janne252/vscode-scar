'use strict';

import LuaWorkspaceParser from './parser';

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

    constructor()
    {
        this._parsers = [];
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