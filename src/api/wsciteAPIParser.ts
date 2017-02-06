import {Parser} from '../scar';

export enum ParseMode
{
    Enums, ScarFunctions, LuaLib
}

export default class WSciteAPIParser extends Parser
{
    public readonly parseMode: ParseMode;
    
    constructor(filepath: string, encoding: string = "utf-8", mode: ParseMode)
    {
        super(filepath, encoding);
        this.parseMode = mode;
    }

    protected processData(data: string): void
    {
        let lines = data.split(/\r?\n/g);

        for(let line of lines)
        {
            switch(this.parseMode)
            {
                case ParseMode.Enums:
                    break;
                case ParseMode.LuaLib:
                    break;
                case ParseMode.ScarFunctions:
                    break;
            }
        }
    }
}