import * as vscode from "vscode";
import { commandInput } from "../utils";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";

export default function (context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showWarningMessage("Add Workspace Command");
    try {
      const val = await commandInput();
      let c = Command.getWorkspaceCommands(context);
      const command = Command.create(val.name, val.cmd);
      c.push(command);
      context.workspaceState.update(COMMAND_STORAGE_KEY, c);
      vscode.window.showInformationMessage(
        "Added Workspace Command Successfully"
      );
      vscode.commands.executeCommand(ExecCommands.refreshView);
    } catch (er) {
      vscode.window.showErrorMessage("Error Adding Command");
      console.error(er);
    }
  };
}
