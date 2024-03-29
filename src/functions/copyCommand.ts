import * as vscode from "vscode";
import TreeItem from "../TreeItem";
import Command, { ResolveCommandType } from "../models/command";
import ReadableError from "../models/error";

export default function (context: vscode.ExtensionContext) {
  return async (item: TreeItem) => {
    let c: Array<Command>;
    try {
      if (item.contextValue === "child-workspace") {
        c = Command.getWorkspaceCommands(context);
      } else if (item.contextValue === "child-global") {
        c = Command.getGlobalCommands(context);
      } else {
        throw new ReadableError("Unknown contextValue");
      }
      const i = c.findIndex((d: Command) => d.id === item.cmdId);
      if (i > -1) {
        const resolvedCommand = await c[i].resolveCommand(
          context,
          ResolveCommandType.copy
        );
        vscode.env.clipboard.writeText(resolvedCommand);
        vscode.window.showInformationMessage(
          `${c[i].name} Command Copied to Clipboard`
        );
      } else {
        throw Error("Unable to find the command in state");
      }
    } catch (e) {
      vscode.window.showErrorMessage("Unable to copy the command");
    }
  };
}
