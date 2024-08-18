import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import type TreeItem from "../TreeItem";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		confirmationDialog({
			onConfirm: () => {
				ReadableError.runGuarded(async () => {
					const { etter } = Command.getEtterFromTreeContext(item);
					const commands = etter.getValue(context);
					const i = commands.findIndex((d: Command) => d.id === item.id);
					if (i > -1) {
						commands.splice(i, 1);
					}
					etter.setValue(context, commands);
					vscode.commands.executeCommand(ExecCommands.refreshView);
				}, "Failed Deleting Command");
			},
			message: "Are you sure you want to delete the command?",
		});
	};
}
