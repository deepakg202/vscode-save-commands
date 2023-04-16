import * as vscode from "vscode";
import { confirmationDialog } from "../utils";
import TreeItem from "../TreeItem";

export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    confirmationDialog({
      onConfirm: () => {
        if (item.contextValue === "child-global") {
          let c = (context.globalState.get("commands") as Array<object>) || [];
          const i = c.findIndex((d: any) => d.id === item.cmdId);
          if (i > -1) {
            c.splice(i, 1);
          }
          context.globalState.update("commands", c);
        } else if (item.contextValue === "child-workspace") {
          let c =
            (context.workspaceState.get("commands") as Array<object>) || [];
          const i = c.findIndex((d: any) => d.id === item.cmdId);
          if (i > -1) {
            c.splice(i, 1);
          }
          context.workspaceState.update("commands", c);
        }
        vscode.commands.executeCommand("save-commands.refreshView");
      },
      message: "Are you sure you want to delete the command?",
    });
  };
}
