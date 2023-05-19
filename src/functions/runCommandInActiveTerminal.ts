import * as vscode from "vscode";
import TreeItem from "../TreeItem";
import Command, { ResolveCommandType } from "../models/command";
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
        const activeTerminal = vscode.window.activeTerminal;
        if (!activeTerminal) {
          throw new ReadableError("No Active Terminal Found");
        }

        // TODO: Come back later to this
        const resolvedCommand = await commands[i].resolveCommand(
          context,
          ResolveCommandType.runActive
        );
        activeTerminal.sendText(resolvedCommand);
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
