import * as vscode from "vscode";
import type TreeItem from "../TreeItem";
import Command, { ResolveCommandType } from "../models/command";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		ReadableError.runGuarded(async () => {
			const { etter } = Command.getEtterFromTreeContext(item);
			const commands = etter.getValue(context);

			const i = commands.findIndex((d: Command) => d.id === item.id);
			if (i > -1) {
				const resolvedCommand = await commands[i].resolveCommand(
					context,
					ResolveCommandType.copy,
				);
				vscode.env.clipboard.writeText(resolvedCommand);
				vscode.window.showInformationMessage(
					`${commands[i].name} Command Copied to Clipboard`,
				);
			} else {
				throw new ReadableError("Unable to find the command in state");
			}
		}, "Unable to copy the command");
	};
}
