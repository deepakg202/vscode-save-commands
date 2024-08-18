import * as vscode from "vscode";
import ReadableError from "../models/error";
import { BackupModel } from "../models/backup";
import * as fs from "node:fs/promises";
import { CommandFolder } from "../models/command_folder";
import Command from "../models/command";
import { confirmationDialog, Decision } from "../utils";
export default function (context: vscode.ExtensionContext) {
	return async () => {
		ReadableError.runGuarded(async () => {
			const jsonPath = await vscode.window.showOpenDialog({
				title: "Import",
				openLabel: "Import JSON",
				canSelectMany: false,
				canSelectFiles: true,
				canSelectFolders: false,
				filters: {
					JSON: ["json"],
				},
			});

			if (!jsonPath) return;

			const json = await fs.readFile(jsonPath[0].fsPath, "utf-8");

			const backupModel = BackupModel.fromJson(JSON.parse(json));

			if (!backupModel.global || !backupModel.workspace) {
				return;
			}
			const replacableStates = [
				backupModel.global && "Global Commands",
				backupModel.workspace && "Workspace Commands",
			].filter((e) => e);

			const decision = await vscode.window.showInformationMessage(
				`Importing will replace all ${replacableStates.join(" and ")}. Are you sure you want to continue ?`,
				Decision.yes,
				Decision.no,
			);
			if (!decision || decision === Decision.no) return;

			backupModel.global?.folders &&
				CommandFolder.etters.global.setValue(
					context,
					backupModel.global?.folders,
				);
			backupModel.global?.commands &&
				Command.etters.global.setValue(context, backupModel.global?.commands);

			backupModel.workspace?.folders &&
				CommandFolder.etters.global.setValue(
					context,
					backupModel.workspace?.folders,
				);
			backupModel.workspace?.commands &&
				Command.etters.workspace.setValue(
					context,
					backupModel.workspace?.commands,
				);

			vscode.window.showInformationMessage("Import successful");
		}, "Failed Importing");
	};
}
