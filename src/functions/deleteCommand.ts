import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import type TreeItem from "../TreeItem";
import Command from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import type { IEtter } from "../models/etters";

export default function (context: vscode.ExtensionContext) {
	return async (item: TreeItem) => {
		confirmationDialog({
			onConfirm: () => {
				const { etter } = Command.getEtterFromTreeContext(item);
				const c = etter.getValue(context);
				const i = c.findIndex((d: Command) => d.id === item.id);
				if (i > -1) {
					c.splice(i, 1);
				}
				etter.setValue(context, c);
				vscode.commands.executeCommand(ExecCommands.refreshView);
			},
			message: "Are you sure you want to delete the command?",
		});
	};
}
