'use strict';

import {IDecorationTypeApplier} from './decorationTypeApplierBase';
import ArrayHelpers from '../helper/arrayHelpers';

export default class DecorationTypeApplierCollection
{
    protected appliers: IDecorationTypeApplier[];

    constructor()
    {
        this.appliers = [];
    }

    public update(): void
    {
        for(let applier of this.appliers)
        {
            applier.update();
        }
    }

    public addApplier(applier: IDecorationTypeApplier): void
    {
        this.appliers.push(applier);
    }

    public removeApplier(applier: IDecorationTypeApplier): void
    {
        ArrayHelpers.remove(this.appliers, applier);
    }
}