'use strict';

import * as _fs from 'fs';
import * as path from 'path';


export default class fs
{
    public static readDirSyncRecursive(rootpath: string): string[]
    {
        var results = [];
        var files = _fs.readdirSync(rootpath);

        for(let file of files)
        {
            file = path.join(rootpath, file);

            var stat = _fs.statSync(file);

            if (stat && stat.isDirectory()) 
            {
                results = results.concat(fs.readDirSyncRecursive(file));
            }
            else 
            {
                results.push(file);
            }
        }
        
        return results;
    }
}