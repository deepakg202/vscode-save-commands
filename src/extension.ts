import * as vscode from "vscode";
import TreeDataProvider from "./TreeProvider";
import { ExecCommands } from "./models/exec_commands";
import "reflect-metadata";
import {
	addCommandFn,
	copyCommandFn,
	deleteCommandFn,
	deleteCommandsFn,
	addFolderFn,
	editCommandFn,
	resetFn,
	runCommandFn,
	runCommandInActiveTerminalFn,
} from "./functions";

export function activate(context: vscode.ExtensionContext) {
	const treeView = new TreeDataProvider(context);

	// biome-ignore lint/suspicious/noExplicitAny: Needed
	const callbacks: Record<ExecCommands, (...args: any[]) => any> = {
		[ExecCommands.addCommand]: addCommandFn(context),
		[ExecCommands.deleteCommand]: deleteCommandFn(context),
		[ExecCommands.runCommand]: runCommandFn(context),
		[ExecCommands.deleteCommands]: deleteCommandsFn(context),
		[ExecCommands.editCommand]: editCommandFn(context),
		[ExecCommands.copyCommand]: copyCommandFn(context),
		[ExecCommands.runCommandInActiveTerminal]:
			runCommandInActiveTerminalFn(context),
		[ExecCommands.reset]: resetFn(context),
		[ExecCommands.refreshView]: () => treeView.refresh(),
		[ExecCommands.addFolder]: addFolderFn(context),
	};

	const subscriptions = Object.keys(callbacks).map((key) => {
		return vscode.commands.registerCommand(key, callbacks[key as ExecCommands]);
	});

	vscode.window.registerTreeDataProvider("save-commands-view", treeView);
	context.subscriptions.push(...subscriptions);
}

// this method is called when your extension is deactivated
export function deactivate() {}
