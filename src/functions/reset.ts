import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import { CommandFolder } from "../models/command_folder";
import ReadableError from "../models/error";
export default function (context: vscode.ExtensionContext) {
	return () => {
		confirmationDialog({
			onConfirm: () => {
				ReadableError.runGuarded(async () => {
					CommandFolder.etters.global.setValue(context, []);
					CommandFolder.etters.workspace.setValue(context, []);
					Command.etters.global.setValue(context, []);
					Command.etters.workspace.setValue(context, []);
					vscode.commands.executeCommand(ExecCommands.refreshView);
				}, "Failed Resetting");
			},
			message: "Are you sure you want to delete all saved commands?",
		});
	};
}
