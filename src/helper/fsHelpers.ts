'use strict';

import * as _fs from 'fs';
import * as path from 'path';

/**
 * Represents a collection of fs helper functions.
 */
export default class FSHelpers
{
    /**
     * Returns an array containing all files in a directory, synchronously and recursively.
     * @param rootpath The root path of the directory.
     */
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
                results = results.concat(FSHelpers.readDirSyncRecursive(file));
            }
            else 
            {
                results.push(file);
            }
        }
        
        return results;
    }
}