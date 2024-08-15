import * as vscode from "vscode";
class TreeItem extends vscode.TreeItem {
	children: TreeItem[] | undefined;
	cmdId: string | undefined | null;
	constructor(
		cmdId: string | undefined | null,
		label: string,
		tooltip?: string,
		contextValue?: string,
		children?: TreeItem[],
	) {
		super(
			label,
			children === undefined
				? vscode.TreeItemCollapsibleState.None
				: vscode.TreeItemCollapsibleState.Expanded,
		);
		this.children = children;
		this.tooltip = tooltip;
		this.cmdId = cmdId;
		this.contextValue = contextValue;
	}
}

export default TreeItem;
