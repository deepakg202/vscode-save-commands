import * as vscode from "vscode";

export default class ReadableError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ReadableError";
	}

	static async runGuarded(
		callback: () => Promise<void>,
		defaultMessage?: string,
	): Promise<unknown> {
		try {
			await callback();
		} catch (er) {
			if (er instanceof ReadableError) {
				vscode.window.showErrorMessage(er.message);
				return;
			}
			vscode.window.showErrorMessage(defaultMessage ?? "Something went wrong!");
		}
	}
}
