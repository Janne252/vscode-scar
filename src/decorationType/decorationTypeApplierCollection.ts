'use strict';

import * as async from 'async';
import {TextEditor, TextEditorDecorationType, Range} from 'vscode';
import {IDecorationTypeApplier, IDecorationSet, DecorationSetCollection} from './decorationTypeApplierBase';
import ArrayHelpers from '../helper/arrayHelpers';

/**
 * Represents a collection of DecorationTypeAppliers.
 */
export default class DecorationTypeApplierCollection
{
    /**
     * The appliers that are managed by this collection.
     */
    protected appliers: IDecorationTypeApplier[];
    /**
     * Language id that the TextEditor document must be in order to apply the highlights.
     */
    public languageId: string;
    /**
     * Creates a new instance of DecorationTypeApplierCollection.
     */

    protected decorationSets: DecorationSetCollection;

    constructor(languageId: string)
    {
        this.languageId = languageId;
        this.appliers = [];
        this.decorationSets = new DecorationSetCollection();
    }
    /**
     * Updates all the DecorationTypeAppliers.
     * @param textEditor The text editor to add the decorations to.
     */
    public update(textEditor: TextEditor): void
    {
        console.time('DecorationTypeAppliers');
        this.decorationSets.clear();

        if (textEditor !== undefined && textEditor.document.languageId == this.languageId)
        {
            this.appliers.forEach(applier => applier.update(textEditor, this.decorationSets));
            this.decorationSets.update(textEditor);
        }
        console.timeEnd('DecorationTypeAppliers');
    }
    /**
     * Adds an applier to this collection.
     * @param applier The applier to add.
     */
    public addApplier(applier: IDecorationTypeApplier): void
    {
        this.appliers.push(applier);
    }
    /**
     * Removes an applier from this collection.
     * @param applier The applier to remove.
     */
    public removeApplier(applier: IDecorationTypeApplier): void
    {
        ArrayHelpers.remove(this.appliers, applier);
    }
}
