'use strict';

import {SignatureHelp} from 'vscode';

export default class NamedSignatureHelp extends SignatureHelp
{
    public name: string;

    constructor(name: string)
    {
        super();
        this.name = name;
    }
}