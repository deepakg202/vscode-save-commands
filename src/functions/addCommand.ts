import * as vscode from "vscode";
import { CommandInputType, commandInput } from "../utils";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import type TreeItem from "../TreeItem";
import { StateType } from "../models/etters";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		let commandInputType: CommandInputType;

		const { etter, stateType } = Command.getEtterFromTreeContext(item);

		commandInputType =
			stateType === StateType.global
				? CommandInputType.addGlobal
				: CommandInputType.addWorkspace;

		vscode.window.showWarningMessage("Add Command");
		try {
			const newCommand = await commandInput(commandInputType);
			const c = etter.getValue(context);
			c.push(newCommand);
			etter.setValue(context, c);
			vscode.window.showInformationMessage("Added Command Successfully");
			vscode.commands.executeCommand(ExecCommands.refreshView);
		} catch (er) {
			vscode.window.showErrorMessage("Error Adding Command");
			console.error(er);
		}
	};
}
