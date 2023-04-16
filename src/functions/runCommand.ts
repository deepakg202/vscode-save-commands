import * as vscode from "vscode";
import TreeItem from "../TreeItem";
import Command from "../models/command";
import ReadableError from "../models/error";
import { generateString } from "../utils";

// TODO: Can be refactored
export default function (context: vscode.ExtensionContext) {
  return (item: TreeItem) => {
    let c: any;
    try {
      if (item.contextValue === "child-workspace") {
        c = Command.getWorkspaceCommands(context);
      } else if (item.contextValue === "child-global") {
        c = Command.getGlobalCommands(context);
      }
      const i = c.findIndex((d: any) => d.id === item.cmdId);
      if (i > -1) {
        const terminalId = `${c[i].name}-${generateString(5)}`;
        const terminal = vscode.window.createTerminal(terminalId);
        terminal.sendText(c[i].command);
        terminal.show();
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
