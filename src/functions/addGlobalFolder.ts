import * as vscode from "vscode";
import { commandFolderInput } from "../utils";
import { ExecCommands } from "../models/exec_commands";
import {
	COMMAND_FOLDERS_STORAGE_KEY,
	CommandFolder,
} from "../models/command_folder";

export default function (context: vscode.ExtensionContext) {
	return async () => {
		vscode.window.showWarningMessage("Add Global Command Folder");
		try {
			const newFolder = await commandFolderInput();
			const c = CommandFolder.getGlobalFolders(context);

			// TODO: sort by sortOrder
			c.push(newFolder);
			context.globalState.update(COMMAND_FOLDERS_STORAGE_KEY, c);

			vscode.window.showInformationMessage(
				"Added Workspace Folder Successfully",
			);
			vscode.commands.executeCommand(ExecCommands.refreshView);
		} catch (er) {
			vscode.window.showErrorMessage("Error Adding Command Folder");
			console.error(er);
		}
	};
}
