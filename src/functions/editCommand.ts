import * as vscode from "vscode";
import { commandInput } from "../utils";
import TreeItem from "../TreeItem";

export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    let c: any;
    try {
      if (item.contextValue === "child-workspace") {
        c = (context.workspaceState.get("commands") as Array<object>) || [];
      } else if (item.contextValue === "child-global") {
        c = (context.globalState.get("commands") as Array<object>) || [];
      }
      const i = c.findIndex((d: any) => d.id === item.cmdId);
      if (i > -1) {
        const val = await commandInput({ name: c[i].name, cmd: c[i].command });
        c[i].name = val.name;
        c[i].command = val.cmd;
        if (item.contextValue === "child-workspace") {
          context.workspaceState.update("commands", c);
        } else if (item.contextValue === "child-global") {
          context.globalState.update("commands", c);
        }
        vscode.commands.executeCommand("save-commands.refreshView");
      } else {
        throw Error("Unable to find the command in state");
      }
    } catch (e) {
      vscode.window.showErrorMessage("Unable to edit the command");
    }
  };
}
