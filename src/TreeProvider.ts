import * as vscode from "vscode";
import TreeItem from "./TreeItem";
import Command from "./models/command";
import { CommandFolder } from "./models/command_folder";

export enum RootTreeItemContext {
	parentGlobal = "parent-global",
	parentWorkspace = "parent-workspace",
}

enum ItemType {
	command = "command",
	folder = "folder",
}

interface ITreeItem {
	id: string | null;
	name: string;
	tooltip: string;
	sortOrder?: number;
	type: ItemType;
	children: Array<ITreeItem>;
}

class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
	data: TreeItem[];
	private _onDidChangeTreeData: vscode.EventEmitter<
		TreeItem | undefined | undefined
	> = new vscode.EventEmitter<TreeItem | undefined | undefined>();
	readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | undefined> =
		this._onDidChangeTreeData.event;
	context: vscode.ExtensionContext;
	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.data = [];
		this.refreshData();
	}

	private createTreeMap(
		commands: Array<Command>,
		folders: Array<CommandFolder>,
	): Array<ITreeItem> {
		const items: Array<ITreeItem> = [];
		const foldersMap: Record<string, ITreeItem> = {};

		for (const folder of folders) {
			console.log(folder.parentFolderIds);

			const folderId = [folder.id].join("/");
			const treeItem = {
				id: folder.id,
				name: folder.name,
				children: [],
				type: ItemType.folder,
				tooltip: "",
			};
			items.push(treeItem);
			foldersMap[folderId] = treeItem;
		}

		for (const command of commands) {
			const folder = command.folderIds?.join("/");
			if (!folder || !foldersMap[folder]) {
				items.push({
					id: command.id,
					name: command.name,
					tooltip: command.command,
					sortOrder: command.sortOrder,
					type: ItemType.command,
					children: [],
				});
				continue;
			}
			foldersMap[folder].children.push({
				id: command.id,
				name: command.name,
				tooltip: command.command,
				sortOrder: command.sortOrder,
				type: ItemType.command,
				children: [],
			});
		}

		// TODO: Sort based on sort order
		return items;
	}

	refreshData(): void {
		const globalCommands: Array<Command> = Command.etters.global.getValue(
			this.context,
		);
		const globalFolders: Array<CommandFolder> =
			CommandFolder.etters.global.getValue(this.context);

		const workspaceCommands: Array<Command> = Command.etters.workspace.getValue(
			this.context,
		);
		const workspaceFolders: Array<CommandFolder> =
			CommandFolder.etters.workspace.getValue(this.context);

		const globalTree = this.createTreeMap(globalCommands, globalFolders);
		const workspaceTree = this.createTreeMap(
			workspaceCommands,
			workspaceFolders,
		);

		const globalBasePath = "child-global";
		const globalTreeItems: Array<TreeItem> =
			globalTree.length !== 0
				? globalTree.map(
						(d) =>
							new TreeItem(
								d.id,
								d.name,
								d.tooltip,
								`${globalBasePath}-${d.type}`,
							),
					)
				: [new TreeItem(null, "No Commands Found")];

		const workspaceBasePath = "child-workspace";
		const workspaceTreeItems: Array<TreeItem> =
			workspaceTree.length !== 0
				? workspaceTree.map(
						(d) =>
							new TreeItem(
								d.id,
								d.name,
								d.tooltip,
								`${workspaceBasePath}-${d.type}`,
							),
					)
				: [new TreeItem(null, "No Commands Found")];

		this.data = [
			new TreeItem(
				null,
				"Global Commands",
				"",
				RootTreeItemContext.parentGlobal,
				globalTreeItems,
			),
			new TreeItem(
				null,
				"Workspace Commands",
				"",
				RootTreeItemContext.parentWorkspace,
				workspaceTreeItems,
			),
		];
	}

	refresh(): void {
		this.refreshData();
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(
		element?: TreeItem | undefined,
	): vscode.ProviderResult<TreeItem[]> {
		if (element === undefined) {
			return this.data;
		}
		return element.children;
	}
}

export default TreeDataProvider;
