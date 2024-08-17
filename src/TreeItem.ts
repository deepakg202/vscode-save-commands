import * as vscode from "vscode";
import type { StateType } from "./models/etters";
import { ContextValue } from "./TreeProvider";
import path = require("node:path");

class TreeItem extends vscode.TreeItem {
	children: TreeItem[] | undefined;
	parentFolderId?: string | null;
	sortOrder?: number;

	stateType: StateType;

	// @ts-ignore
	get collapsibleState(): vscode.TreeItemCollapsibleState {
		if (this.children === undefined || this.children.length === 0)
			return vscode.TreeItemCollapsibleState.None;
		return vscode.TreeItemCollapsibleState.Expanded;
	}

	set collapsibleState(val: vscode.TreeItemCollapsibleState) {}

	constructor(fields: {
		id: string | undefined | null;
		label: string;
		tooltip?: string;
		contextValue: ContextValue;
		children?: TreeItem[];
		parentFolderId?: string | null;
		sortOrder?: number;
		stateType: StateType;
	}) {
		super(fields.label);
		this.children = fields.children;
		this.tooltip = fields.tooltip;
		this.id = fields.id ?? undefined;
		this.contextValue = fields.contextValue ?? undefined;
		this.parentFolderId = fields.parentFolderId;
		this.sortOrder = fields.sortOrder;
		this.stateType = fields.stateType;

		if (this.contextValue === ContextValue.folder) {
			this.iconPath = new vscode.ThemeIcon("folder");
		} else if(this.contextValue === ContextValue.command) {
			this.iconPath = new vscode.ThemeIcon("terminal")
		}
	}
}

export default TreeItem;
