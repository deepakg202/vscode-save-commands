import * as vscode from "vscode";
import TreeItem from "../TreeItem";
import { COMMAND_STORAGE_KEY } from "../models/command";

export default function (context: vscode.ExtensionContext) {
  return (item: TreeItem) => {
    let c: any;
    try {
      if (item.contextValue === "child-workspace") {
        c =
          (context.workspaceState.get(COMMAND_STORAGE_KEY) as Array<object>) ??
          [];
      } else if (item.contextValue === "child-global") {
        c =
          (context.globalState.get(COMMAND_STORAGE_KEY) as Array<object>) ?? [];
      }
      const i = c.findIndex((d: any) => d.id === item.cmdId);
      if (i > -1) {
        vscode.env.clipboard.writeText(c[i].command);
        vscode.window.showInformationMessage(
          `${c[i].name} Command Copied to Clipboard`
        );
      } else {
        throw Error("Unable to find the command in state");
      }
    } catch (e) {
      vscode.window.showErrorMessage("Unable to execute the command");
    }
  };
}
