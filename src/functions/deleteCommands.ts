import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import type TreeItem from "../TreeItem";

export default function (context: vscode.ExtensionContext) {
	return (item: TreeItem) => {
		const { etter, stateType } = Command.getEtterFromTreeContext(item);

		const commands = etter.getValue(context);
		if (!commands || commands.length === 0) {
			return;
		}
		confirmationDialog({
			onConfirm: () => {
				etter.setValue(context, []);
				vscode.commands.executeCommand(ExecCommands.refreshView);
				vscode.window.showInformationMessage(`${stateType} Commands Deleted`);
			},
			message: `Are you sure you want to delete all ${stateType} commands?`,
		});
	};
}
