import * as vscode from "vscode";
import { commandFolderInput } from "../utils";
import type TreeItem from "../TreeItem";
import { ExecCommands } from "../models/exec_commands";
import ReadableError from "../models/error";
import { CommandFolder } from "../models/command_folder";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		let commands: Array<CommandFolder>;
		try {
			const { etter } = CommandFolder.getEtterFromTreeContext(item);

			commands = etter.getValue(context);
			vscode.window.showInformationMessage("Edit Folder");
			const i = commands.findIndex((d: CommandFolder) => d.id === item.id);
			if (i > -1) {
				const val = await commandFolderInput({
					name: commands[i].name,
				});
				commands[i].name = val.name;
				etter.setValue(context, commands);
				vscode.commands.executeCommand(ExecCommands.refreshView);
			} else {
				throw new ReadableError("Unable to find the folder in state");
			}
		} catch (e) {
			vscode.window.showErrorMessage("Unable to edit the command");
		}
	};
}
