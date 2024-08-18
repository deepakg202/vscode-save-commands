import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import type TreeItem from "../TreeItem";
import { ExecCommands } from "../models/exec_commands";
import { CommandFolder } from "../models/command_folder";
import Command from "../models/command";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		confirmationDialog({
			onConfirm: () => {
				ReadableError.runGuarded(async () => {
					const { etter } = CommandFolder.getEtterFromTreeContext(item);
					const folders = etter.getValue(context);
					const i = folders.findIndex((d: CommandFolder) => d.id === item.id);
					if (i > -1) {
						folders.splice(i, 1);
					}
					etter.setValue(context, folders);

					const { etter: commandEtter } = Command.getEtterFromTreeContext(item);
					const commands = commandEtter.getValue(context);
					const filteredCommands = commands.filter(
						(c) => c.parentFolderId !== item.id,
					);
					commandEtter.setValue(context, filteredCommands);

					vscode.commands.executeCommand(ExecCommands.refreshView);
				}, "Failed Deleting Folder");
			},
			message:
				"Are you sure you want to delete the folder with all the commands inside ?",
		});
	};
}
