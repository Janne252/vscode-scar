'use strict';

import {CompletionItem, CompletionItemKind, TextEdit, Command} from 'vscode';

export default class CompletionItemBase implements CompletionItem
{
	/**
	 * The label of this completion item. By default
	 * this is also the text that is inserted when selecting
	 * this completion.
	 */
	label: string;

	/**
	 * The kind of this completion item. Based on the kind
	 * an icon is chosen by the editor.
	 */
	kind: CompletionItemKind;

	/**
	 * A human-readable string with additional information
	 * about this item, like type or symbol information.
	 */
	detail: string;

	/**
	 * A human-readable string that represents a doc-comment.
	 */
	documentation: string;

	/**
	 * A string that should be used when comparing this item
	 * with other items. When `falsy` the [label](#CompletionItem.label)
	 * is used.
	 */
	sortText: string;

	/**
	 * A string that should be used when filtering a set of
	 * completion items. When `falsy` the [label](#CompletionItem.label)
	 * is used.
	 */
	filterText: string;

	/**
	 * A string that should be inserted in a document when selecting
	 * this completion. When `falsy` the [label](#CompletionItem.label)
	 * is used.
	 */
	insertText: string;

	/**
	 * An [edit](#TextEdit) which is applied to a document when selecting
	 * this completion. When an edit is provided the value of
	 * [insertText](#CompletionItem.insertText) is ignored.
	 *
	 * The [range](#Range) of the edit must be single-line and on the same
	 * line completions were [requested](#CompletionItemProvider.provideCompletionItems) at.
	 */
	textEdit: TextEdit;

	/**
	 * An optional array of additional [text edits](#TextEdit) that are applied when
	 * selecting this completion. Edits must not overlap with the main [edit](#CompletionItem.textEdit)
	 * nor with themselves.
	 */
	additionalTextEdits: TextEdit[];

	/**
	 * An optional [command](#Command) that is executed *after* inserting this completion. *Note* that
	 * additional modifications to the current document should be described with the
	 * [additionalTextEdits](#CompletionItem.additionalTextEdits)-property.
	 */
	command: Command;

    /**
     * Creates a new completion item.
     *
     * Completion items must have at least a [label](#CompletionItem.label) which then
     * will be used as insert text as well as for sorting and filtering.
     *
     * @param label The label of the completion.
     * @param kind The [kind](#CompletionItemKind) of the completion.
     */
    constructor(label: string, kind?: CompletionItemKind)
    {
        this.label = label;
        this.kind = kind;
    }
}