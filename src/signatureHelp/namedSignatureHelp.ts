'use strict';

import {SignatureHelp, ParameterInformation, SignatureInformation} from 'vscode';

export default class NamedSignatureHelp extends SignatureHelp
{
    public name: string;

    public get signatureInformation(): SignatureInformation
    {
        if (this.signatures.length > 0)
        {
            this.signatures[0];
        }
        else
        {
            return undefined;
        }
    }

    public get parameterCount(): number
    {
        if (this.signatureInformation !== undefined)
        {
            return this.signatureInformation.parameters.length;
        }
        else
        {
            return 0;
        }
    }

    public get lastParameter(): ParameterInformation
    {
        if (this.parameterCount > 0)
        {
            return this.signatureInformation.parameters[this.parameterCount - 1];
        }
        else
        {
            return undefined;
        }
    }

    public get lastParameterIsList(): boolean
    {
        let lastParameter = this.lastParameter;

        if (lastParameter !== undefined)
        {
            return lastParameter.label == '...';
        }
        else
        {
            return false;
        }
    }

    constructor(name: string)
    {
        super();
        this.name = name;
    }
}