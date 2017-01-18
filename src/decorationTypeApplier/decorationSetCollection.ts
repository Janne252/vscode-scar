'use strict';

import {TextEditor} from 'vscode';
import {IDecorationSet, IDecorationSetCollection} from './types';

/**
 * Set of DecorationSets.
 */
export default class DecorationSetCollection implements IDecorationSetCollection
{
    /**
     * List of sets.
     */
    protected sets: IDecorationSet[];
    /**
     * Creates a new instance of DecorationSetCollection.
     */
    constructor()
    {
        this.clear();
    }
    /**
     * Removes all DecorationSets.
     */
    public clear(): void
    {
        this.sets = [];
    }
    /**
     * Adds a new DecorationSet to the collection.
     * @param setToAdd The set to add.
     */
    public add(setToAdd: IDecorationSet): void
    {
        let exists = false;
        for(let existingSet of this.sets)
        {
            if (existingSet.decorationType == setToAdd.decorationType)
            {
                exists = true;
                existingSet.ranges = existingSet.ranges.concat(setToAdd.ranges);
                break;
            }
        }
        if (!exists)
        {
            this.sets.push(setToAdd);
        }
    }
    /**
     * Applies all decorations to a TextEditor.
     * @param textEditor The TextEditor to apply the decorations.
     */
    public update(textEditor: TextEditor): void
    {
        this.sets.forEach(set => textEditor.setDecorations(set.decorationType, set.ranges));
    }
}