import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import TreeItem from "../TreeItem";
import Command, { COMMAND_STORAGE_KEY } from "../models/command";
import { ExecCommands } from "../models/exec_commands";

export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    confirmationDialog({
      onConfirm: () => {
        if (item.contextValue === "child-global") {
          let c = Command.getGlobalCommands(context);
          const i = c.findIndex((d: Command) => d.id === item.cmdId);
          if (i > -1) {
            c.splice(i, 1);
          }
          context.globalState.update(COMMAND_STORAGE_KEY, c);
        } else if (item.contextValue === "child-workspace") {
          let c = Command.getWorkspaceCommands(context);
          const i = c.findIndex((d: Command) => d.id === item.cmdId);
          if (i > -1) {
            c.splice(i, 1);
          }
          context.workspaceState.update(COMMAND_STORAGE_KEY, c);
        }
        vscode.commands.executeCommand(ExecCommands.refreshView);
      },
      message: "Are you sure you want to delete the command?",
    });
  };
}
