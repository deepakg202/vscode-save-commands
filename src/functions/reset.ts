import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";
export default function (context: vscode.ExtensionContext) {
  return () => {
    confirmationDialog({
      onConfirm: () => {
        context.workspaceState.update(COMMAND_STORAGE_KEY, []);
        context.globalState.update(COMMAND_STORAGE_KEY, []);
        vscode.commands.executeCommand(ExecCommands.refreshView);
      },
      message: "Are you sure you want to delete all saved commands?",
    });
  };
}
