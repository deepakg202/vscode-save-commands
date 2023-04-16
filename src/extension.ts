import * as vscode from "vscode";
import * as utils from "./utils";
import TreeDataProvider from "./TreeProvider";
import TreeItem from "./TreeItem";
import addCommandFn from "./functions/addWorkspaceCommand";
import addGlobalCommandFn from "./functions/addGlobalCommand";
import deleteWorkspaceCommands from "./functions/deleteWorkspaceCommands";
import deleteGlobalCommands from "./functions/deleteGlobalCommands";
import deleteCommandFn from "./functions/deleteCommand";
import editCommandFn from "./functions/editCommand";
import resetFn from "./functions/reset";
import copyCommandFn from "./functions/copyCommand";

const terminals: Array<vscode.Terminal> = [];

export function activate(context: vscode.ExtensionContext) {
  const treeView = new TreeDataProvider(context);
  const addCommand = vscode.commands.registerCommand(
    "save-commands.addCommand",
    addCommandFn(context)
  );
  const addGlobalCommand = vscode.commands.registerCommand(
    "save-commands.addGlobalCommand",
    addGlobalCommandFn(context)
  );

  const deleteWorkspace = vscode.commands.registerCommand(
    "save-commands.deleteWorkspaceCommands",
    deleteWorkspaceCommands(context)
  );
  const deleteGlobal = vscode.commands.registerCommand(
    "save-commands.deleteGlobalCommands",
    deleteGlobalCommands(context)
  );

  const deleteCommand = vscode.commands.registerCommand(
    "save-commands.deleteCommand",
    deleteCommandFn(context)
  );

  const editCommand = vscode.commands.registerCommand(
    "save-commands.editCommand",
    editCommandFn(context)
  );

  const copyCommand = vscode.commands.registerCommand(
    "save-commands.copyCommand",
    copyCommandFn(context)
  );

  const runCommand = vscode.commands.registerCommand(
    "save-commands.runCommand",
    (item: TreeItem) => {
      let c: any;
      try {
        if (item.contextValue === "child-workspace") {
          c = (context.workspaceState.get("commands") as Array<object>) || [];
        } else if (item.contextValue === "child-global") {
          c = (context.globalState.get("commands") as Array<object>) || [];
        }
        const i = c.findIndex((d: any) => d.id === item.cmdId);
        if (i > -1) {
          const terminalId = `${c[i].name}-${utils.generateString(5)}`;
          const terminal = vscode.window.createTerminal(terminalId);
          terminal.sendText(c[i].command);
          terminal.show();
        } else {
          throw Error("Unable to find the command in state");
        }
      } catch (e) {
        vscode.window.showErrorMessage("Unable to execute the command");
      }
    }
  );
  const reset = vscode.commands.registerCommand(
    "save-commands.reset",
    resetFn(context)
  );

  const refreshView = vscode.commands.registerCommand(
    "save-commands.refreshView",
    () => treeView.refresh()
  );

  vscode.window.registerTreeDataProvider("save-commands-view", treeView);
  context.subscriptions.push(
    addCommand,
    addGlobalCommand,
    deleteWorkspace,
    deleteGlobal,
    deleteCommand,
    runCommand,
    copyCommand,
    editCommand,
    refreshView,
    reset
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  terminals.forEach((terminal) => terminal.dispose());
}
