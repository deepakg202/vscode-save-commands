import * as vscode from "vscode";
import * as childProcess from "child_process";
import TreeItem from "../TreeItem";
import Command from "../models/command";
import ReadableError from "../models/error";

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
        const activeTerminal = vscode.window.activeTerminal;
        if (!activeTerminal) {
          throw new ReadableError("No Active Terminal Found");
        }

        // TODO: Come back later to this
        activeTerminal.sendText(c[i].command);
        activeTerminal.show();
      } else {
        throw new ReadableError("Unable to find the command in state");
      }
    } catch (e) {
      if (e instanceof ReadableError) {
        vscode.window.showErrorMessage(e.message);
        return;
      }
      vscode.window.showErrorMessage("Unable to execute the command");
    }
  };
}
