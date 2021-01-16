import * as vscode from 'vscode';


class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  
  data: TreeItem[];

  constructor(context: vscode.ExtensionContext) {
    const global:Array<object> = context.globalState.get('commands') as Array<object>;
    const workspace:Array<object> = context.workspaceState.get('commands') as Array<object>;
    const globalTreeItems:Array<TreeItem> = global ?global.map((d:any) => new TreeItem(d.name)) : [new TreeItem('No Commands Found')];
    const workspaceTreeItems:Array<TreeItem> = workspace ?workspace.map((d:any) => new TreeItem(d.name)) : [new TreeItem('No Commands Found')];
  
    this.data = [
      new TreeItem('Global Commands', globalTreeItems),
      new TreeItem('Workspace Commands', workspaceTreeItems)
    ];
  }
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(label: string, children?: TreeItem[]) {
    super(label,
        children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
  }
}

export default TreeDataProvider;