import * as vscode from "vscode";
import { CommandInputType, commandInput } from "../utils";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import type TreeItem from "../TreeItem";
import { StateType } from "../models/etters";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		ReadableError.runGuarded(async () => {
			const { etter, stateType } = Command.getEtterFromTreeContext(item);

			const commandInputType =
				stateType === StateType.global
					? CommandInputType.addGlobal
					: CommandInputType.addWorkspace;

			vscode.window.showWarningMessage("Add Command");
			const newCommand = await commandInput(commandInputType);
			const commands = etter.getValue(context);
			commands.push(newCommand);
			etter.setValue(context, commands);
			vscode.window.showInformationMessage("Added Command Successfully");
			vscode.commands.executeCommand(ExecCommands.refreshView);
		}, "Error Adding Command");
	};
}
