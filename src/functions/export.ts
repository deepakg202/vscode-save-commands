import * as vscode from "vscode";
import ReadableError from "../models/error";
import { BackupModel } from "../models/backup";
import Command from "../models/command";
import { CommandFolder } from "../models/command_folder";
import * as fs from "node:fs/promises";
export default function (context: vscode.ExtensionContext) {
	return async () => {
		ReadableError.runGuarded(async () => {
			const savePath = await vscode.window.showSaveDialog({
				title: "Export",
				filters: {
					JSON: ["json"],
				},
			});

			if (!savePath) return;
			const backupModel = BackupModel.fromJsonSafe({
				global: {
					commands: Command.etters.global.getValue(context),
					folders: CommandFolder.etters.global.getValue(context),
				},
				workspace: {
					commands: Command.etters.workspace.getValue(context),
					folders: CommandFolder.etters.workspace.getValue(context),
				},
			});

			await fs.writeFile(
				savePath.fsPath,
				JSON.stringify(backupModel.toJson()),
				"utf-8",
			);

			vscode.window.showInformationMessage("Backup successful");
		}, "Failed Exporting");
	};
}
