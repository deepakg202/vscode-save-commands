import * as vscode from "vscode";
import { commandInput } from "../utils";
import TreeItem from "../TreeItem";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";

// TODO: Can be refactored
export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    let c: any;
    try {
      if (item.contextValue === "child-workspace") {
        c = Command.getWorkspaceCommands(context);
      } else if (item.contextValue === "child-global") {
        c = Command.getGlobalCommands(context);
      }
      const i = c.findIndex((d: any) => d.id === item.cmdId);
      if (i > -1) {
        const val = await commandInput({ name: c[i].name, cmd: c[i].command });
        c[i].name = val.name;
        c[i].command = val.cmd;
        if (item.contextValue === "child-workspace") {
          context.workspaceState.update(COMMAND_STORAGE_KEY, c);
        } else if (item.contextValue === "child-global") {
          context.globalState.update(COMMAND_STORAGE_KEY, c);
        }
        vscode.commands.executeCommand(ExecCommands.refreshView);
      } else {
        throw Error("Unable to find the command in state");
      }
    } catch (e) {
      vscode.window.showErrorMessage("Unable to edit the command");
    }
  };
}
