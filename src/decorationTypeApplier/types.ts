'use strict';

import {TextEditor, TextEditorDecorationType, Range} from 'vscode';

/**
 * Collection of DecorationSets.
 */
export interface IDecorationSetCollection
{
    add(setToAdd: IDecorationSet): void;
    update(textEditor: TextEditor);
    clear(): void;
}
/**
 * Represents minimum implementation of a DecorationTypeApplier.
 */
export interface IDecorationTypeApplier
{
    /**
     * Updates the TextEditor with highlights from this DecorationTypeApplier.
     * @param textEditor The text editor to add the decorations to.
     */
    update(textEditor: TextEditor, sets: IDecorationSetCollection): void;
}

/**
 * Decoration set.
 */
export interface IDecorationSet
{
    /**
     * Decoration type.
     */
    decorationType: TextEditorDecorationType;
    /**
     * Ranges to decorate.
     */
    ranges: Range[];
}
