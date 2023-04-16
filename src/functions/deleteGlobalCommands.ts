import * as vscode from "vscode";
import { confirmationDialog } from "../utils";

export default function (context: vscode.ExtensionContext) {
  return () => {
    const commands = context.globalState.get("commands");
    if (!commands || (commands as Array<any>).length === 0) {
      return;
    }
    confirmationDialog({
      onConfirm: () => {
        context.globalState.update("commands", []);
        vscode.commands.executeCommand("save-commands.refreshView");
        vscode.window.showInformationMessage("Global Commands Deleted");
      },
      message: "Are you sure you want to delete all global commands?",
    });
  };
}
