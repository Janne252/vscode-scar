'use strict';

import {CompletionItem} from 'vscode';

/**
 * Represents a source of CompletionItems.
 */
export interface ICompletionItemSource
{
    /**
     * @prop isReady Whether or not this source is fully loaded.
     */
    isReady: boolean;
    /**
     * Returns the CompletionItems.
     */
    getCompletionItems(): CompletionItem[];
    /**
     * Loads and processes the data the soure requires.
     */
    load(): Thenable<void>;
}

/**
 * Represents a static (non-changing) source of CompletionItems-
 */
export interface IStaticCompletionItemSource extends ICompletionItemSource
{

}

/**
 * Represents an active source of CompletionItems.
 */
export interface IActiveCompletionItemSource extends IStaticCompletionItemSource
{
    /**
     * Returns what the CompletionItems were before the most recent update.
     */
    getPreviousCompletionItems(): CompletionItem[];
    /**
     * Replaces the CompletionItems with a new set.
     */
    updateCompletionItems(items: CompletionItem[]): void;
    /**
     * Adds a singular CompletionItem.
     */
    addCompletionItem(item: CompletionItem): void;
    /**
     * Removes a singular CompletionItem.
     */
    removeCompletionItem(item: CompletionItem): void;
    /**
     * Removes all CompletionItems.
     */
    clear(): void;
    /**
     * The merger to notify of changes.
     */
    merger: ICompletionItemSourceMerger;
}
/**
 * Represents CompletionItem source merger.
 */
export interface ICompletionItemSourceMerger
{
    /**
     * Adds a static source to the merger.
     * @param source The source to add.
     */
    addStaticSource(source: ICompletionItemSource): Thenable<void>;
    /**
     * Removes a static source from the merger.
     * @param source The source to remove.
     */
    removeStaticSource(source: ICompletionItemSource): void;
    /**
     * Adds an active source to the merger.
     * @param source The source to add.
     */
    addActiveSource(source: IActiveCompletionItemSource): Thenable<void>;
    /**
     * Removes an active source from the merger.
     * @param source The source to remove.
     */
    removeActiveSource(source: IActiveCompletionItemSource): void;
    /**
     * Method that is called by active sources when they are updated.
     * @param source The source that was updated.
     */
    activeSourceUpdated(source: IActiveCompletionItemSource): void;
    /**
     * Returns all the CompletionItems.
     */
    getCompletionItems(): CompletionItem[];
}