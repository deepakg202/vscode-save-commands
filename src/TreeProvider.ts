import * as vscode from "vscode";
import TreeItem from "./TreeItem";
import Command from "./models/command";

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  data: TreeItem[];
  private _onDidChangeTreeData: vscode.EventEmitter<
    TreeItem | undefined | void
  > = new vscode.EventEmitter<TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | void> =
    this._onDidChangeTreeData.event;
  context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.data = [];
    this.refreshData();
  }
  refreshData(): void {
    const global: Array<Command> = Command.getGlobalCommands(this.context);
    const workspace: Array<Command> = Command.getWorkspaceCommands(
      this.context
    );

    const globalTreeItems: Array<TreeItem> =
      global.length !== 0
        ? global.map(
            (d) => new TreeItem(d.id, d.name, d.command, "child-global")
          )
        : [new TreeItem(null, "No Commands Found")];

    const workspaceTreeItems: Array<TreeItem> =
      workspace.length !== 0
        ? workspace.map(
            (d) => new TreeItem(d.id, d.name, d.command, "child-workspace")
          )
        : [new TreeItem(null, "No Commands Found")];
        
    this.data = [
      new TreeItem(
        null,
        "Global Commands",
        "",
        "parent-global",
        globalTreeItems
      ),
      new TreeItem(
        null,
        "Workspace Commands",
        "",
        "parent-workspace",
        workspaceTreeItems
      ),
    ];
  }

  refresh(): void {
    this.refreshData();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: TreeItem | undefined
  ): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

export default TreeDataProvider;
