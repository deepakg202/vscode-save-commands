import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";

export default function (context: vscode.ExtensionContext) {
  return () => {
    const commands = Command.getWorkspaceCommands(context);
    if (!commands || commands.length === 0) {
      return;
    }
    confirmationDialog({
      onConfirm: () => {
        context.workspaceState.update(COMMAND_STORAGE_KEY, []);
        vscode.commands.executeCommand(ExecCommands.refreshView);
        vscode.window.showInformationMessage("Workspace Commands Deleted");
      },
      message: "Are you sure you want to delete all workspace commands?",
    });
  };
}
