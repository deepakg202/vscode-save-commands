import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
export default function (context: vscode.ExtensionContext) {
  return () => {
    confirmationDialog({
      onConfirm: () => {
        context.workspaceState.update("commands", []);
        context.globalState.update("commands", []);
        vscode.commands.executeCommand("save-commands.refreshView");
      },
      message: "Are you sure you want to delete all saved commands?",
    });
  };
}
