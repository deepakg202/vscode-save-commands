import * as vscode from "vscode";
import TreeDataProvider from "./TreeProvider";
import addCommandFn from "./functions/addWorkspaceCommand";
import addGlobalCommandFn from "./functions/addGlobalCommand";
import deleteWorkspaceCommands from "./functions/deleteWorkspaceCommands";
import deleteGlobalCommands from "./functions/deleteGlobalCommands";
import deleteCommandFn from "./functions/deleteCommand";
import editCommandFn from "./functions/editCommand";
import resetFn from "./functions/reset";
import copyCommandFn from "./functions/copyCommand";
import { ExecCommands } from "./models/exec_commands";
import runCommandInActiveTerminalFn from "./functions/runCommandInActiveTerminal";
import runCommandFn from "./functions/runCommand";

export function activate(context: vscode.ExtensionContext) {
  const treeView = new TreeDataProvider(context);
  const addCommand = vscode.commands.registerCommand(
    ExecCommands.addCommand,
    addCommandFn(context)
  );
  const addGlobalCommand = vscode.commands.registerCommand(
    ExecCommands.addGlobalCommand,
    addGlobalCommandFn(context)
  );

  const deleteWorkspace = vscode.commands.registerCommand(
    ExecCommands.deleteWorkspaceCommands,
    deleteWorkspaceCommands(context)
  );
  const deleteGlobal = vscode.commands.registerCommand(
    ExecCommands.deleteGlobalCommands,
    deleteGlobalCommands(context)
  );

  const deleteCommand = vscode.commands.registerCommand(
    ExecCommands.deleteCommand,
    deleteCommandFn(context)
  );

  const editCommand = vscode.commands.registerCommand(
    ExecCommands.editCommand,
    editCommandFn(context)
  );

  const copyCommand = vscode.commands.registerCommand(
    ExecCommands.copyCommand,
    copyCommandFn(context)
  );

  const runCommand = vscode.commands.registerCommand(
    ExecCommands.runCommand,
    runCommandFn(context)
  );

  const runCommandInActiveTerminal = vscode.commands.registerCommand(
    ExecCommands.runCommandInActiveTerminal,
    runCommandInActiveTerminalFn(context)
  );
  const reset = vscode.commands.registerCommand(
    ExecCommands.reset,
    resetFn(context)
  );

  const refreshView = vscode.commands.registerCommand(
    ExecCommands.refreshView,
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
    runCommandInActiveTerminal,
    copyCommand,
    editCommand,
    refreshView,
    reset
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
