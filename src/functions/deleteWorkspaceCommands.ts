import * as vscode from "vscode";
import { confirmationDialog } from "../utils";

export default function (context: vscode.ExtensionContext) {
  return () => {
    const commands = context.workspaceState.get("commands");
    if (!commands || (commands as Array<any>).length === 0) {
      return;
    }
    confirmationDialog({
      onConfirm: () => {
        context.workspaceState.update("commands", []);
        vscode.commands.executeCommand("save-commands.refreshView");
        vscode.window.showInformationMessage("Workspace Commands Deleted");
      },
      message: "Are you sure you want to delete all workspace commands?",
    });
  };
}
