import * as vscode from "vscode";
import type TreeItem from "../TreeItem";
import Command, { ResolveCommandType } from "../models/command";
import ReadableError from "../models/error";
import { generateString } from "../utils";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		let commands: Array<Command>;
		try {
			const { etter } = Command.getEtterFromTreeContext(item);
			commands = etter.getValue(context);
			const i = commands.findIndex((d: Command) => d.id === item.cmdId);
			if (i > -1) {
				const terminalId = `${commands[i].name}-${generateString(5)}`;
				const terminal = vscode.window.createTerminal(terminalId);
				const resolvedCommand = await commands[i].resolveCommand(
					context,
					ResolveCommandType.runNew,
				);
				terminal.sendText(resolvedCommand);
				terminal.show();
			} else {
				throw new ReadableError("Unable to find the command in state");
			}
		} catch (e) {
			if (e instanceof ReadableError) {
				vscode.window.showErrorMessage(e.message);
				return;
			}
			vscode.window.showErrorMessage("Unable to execute the command");
		}
	};
}
