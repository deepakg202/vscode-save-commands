import * as vscode from "vscode";
import { commandFolderInput } from "../utils";
import { ExecCommands } from "../models/exec_commands";
import type TreeItem from "../TreeItem";
import { CommandFolder } from "../models/command_folder";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		try {
			const { etter, stateType } = CommandFolder.getEtterFromTreeContext(item);

			vscode.window.showWarningMessage(`Add ${stateType} Command Folder`);

			let parentFolderId: string | undefined;
			if (item.contextValue?.includes("folder")) {
				parentFolderId = item.id;
			}
			const newFolder = await commandFolderInput({ parentFolderId });
			const folders = etter.getValue(context);

			// TODO: sort by sortOrder
			folders.push(newFolder);
			etter.setValue(context, folders);

			vscode.window.showInformationMessage(
				`Added ${stateType} Folder Successfully`,
			);
			vscode.commands.executeCommand(ExecCommands.refreshView);
		} catch (er) {
			vscode.window.showErrorMessage("Error Adding Command Folder");
			console.error(er);
		}
	};
}
