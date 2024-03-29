import * as vscode from "vscode";
import { CommandInputType, commandInput } from "../utils";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";

export default function (context: vscode.ExtensionContext) {
  return async () => {
    vscode.window.showWarningMessage("Add Global Command");
    try {
      const newCommand = await commandInput(CommandInputType.addGlobal);
      let c = Command.getGlobalCommands(context);
      c.push(newCommand);
      context.globalState.update(COMMAND_STORAGE_KEY, c);
      context.globalState.setKeysForSync([COMMAND_STORAGE_KEY]);
      vscode.window.showInformationMessage("Added Global Command Successfully");
      vscode.commands.executeCommand(ExecCommands.refreshView);
    } catch (er) {
      vscode.window.showErrorMessage("Error Adding Command");
      console.error(er);
    }
  };
}
