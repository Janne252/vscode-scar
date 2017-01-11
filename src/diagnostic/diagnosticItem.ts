'use strict';

import {Diagnostic, Range, DiagnosticSeverity} from 'vscode';

export default class DiagnosticItem implements Diagnostic
{
	/**
	 * The range to which this diagnostic applies.
	 */
	public range: Range;

	/**
	 * The human-readable message.
	 */
	public message: string;

	/**
	 * A human-readable string describing the source of this
	 * diagnostic, e.g. 'typescript' or 'super lint'.
	 */
	public source: string;

	/**
	 * The severity, default is [error](#DiagnosticSeverity.Error).
	 */
	public severity: DiagnosticSeverity;

	/**
	 * A code or identifier for this diagnostics. Will not be surfaced
	 * to the user, but should be used for later processing, e.g. when
	 * providing [code actions](#CodeActionContext).
	 */
	public code: string | number;

	/**
	 * Creates a new diagnostic object.
	 *
	 * @param range The range to which this diagnostic applies.
	 * @param message The human-readable message.
	 * @param severity The severity, default is [error](#DiagnosticSeverity.Error).
	 */
	constructor(range: Range, message: string, severity?: DiagnosticSeverity)
	{
		this.range = range;
		this.message = message;
		this.severity = severity;
	}
}