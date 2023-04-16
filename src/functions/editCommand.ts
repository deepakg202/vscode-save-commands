import * as vscode from "vscode";
import { commandInput } from "../utils";
import TreeItem from "../TreeItem";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";
import ReadableError from "../models/error";

// TODO: Can be refactored
export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    let commands: Array<Command>;
    try {
      if (item.contextValue === "child-workspace") {
        commands = Command.getWorkspaceCommands(context);
      } else if (item.contextValue === "child-global") {
        commands = Command.getGlobalCommands(context);
      } else {
        throw new ReadableError("Unknown contextValue");
      }
      const i = commands.findIndex((d: Command) => d.id === item.cmdId);
      if (i > -1) {
        const val = await commandInput({
          name: commands[i].name,
          cmd: commands[i].command,
        });
        commands[i].name = val.name;
        commands[i].command = val.cmd;
        if (item.contextValue === "child-workspace") {
          context.workspaceState.update(COMMAND_STORAGE_KEY, commands);
        } else if (item.contextValue === "child-global") {
          context.globalState.update(COMMAND_STORAGE_KEY, commands);
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
