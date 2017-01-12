'use strict';

import {SignatureInformation} from 'vscode';

export default class SignatureInformationBase extends SignatureInformation
{
    constructor(label: string, documentation: string)
    {
        super(label, documentation);
    }
}