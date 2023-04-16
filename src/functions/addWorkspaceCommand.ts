import * as vscode from "vscode";
import { commandInput, uuidv4 } from "../utils";

export default function (context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showWarningMessage("Add Workspace Command");
    try {
      const val = await commandInput();
      let c = (context.workspaceState.get("commands") as Array<object>) || [];
      const id = uuidv4() as string;
      c.push({ id: id, name: val.name, command: val.cmd });
      context.workspaceState.update("commands", c);
      vscode.window.showInformationMessage(
        "Added Workspace Command Successfully"
      );
      vscode.commands.executeCommand("save-commands.refreshView");
    } catch (er) {
      vscode.window.showErrorMessage("Error Adding Command");
      console.error(er);
    }
  };
}
