import * as vscode from "vscode";
import { CommandInputType, commandInput } from "../utils";
import type TreeItem from "../TreeItem";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		let commands: Array<Command>;
		try {
			const { etter, stateType } = Command.getEtterFromTreeContext(item);

			commands = etter.getValue(context);
			vscode.window.showInformationMessage(
				`Editing ${item.label} | Scope: ${stateType}`,
			);
			const i = commands.findIndex((d: Command) => d.id === item.cmdId);
			if (i > -1) {
				const val = await commandInput(CommandInputType.edit, {
					name: commands[i].name,
					cmd: commands[i].command,
					placeholderType: commands[i].getPlaceholderType(),
				});
				commands[i].name = val.name;
				commands[i].command = val.command;
				etter.setValue(context, commands);
				vscode.commands.executeCommand(ExecCommands.refreshView);
			} else {
				throw new ReadableError("Unable to find the command in state");
			}
		} catch (e) {
			vscode.window.showErrorMessage("Unable to edit the command");
		}
	};
}
