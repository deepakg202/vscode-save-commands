import { instanceToPlain, plainToInstance } from "class-transformer";
import { uuidv4 } from "../utils";
import type { ExtensionContext } from "vscode";
import type { JSONObj } from "./base_types";
export const COMMAND_FOLDERS_STORAGE_KEY = "command_folders";

export class CommandFolder {
	id: string;
	name: string;
	parentPath?: string | undefined;
	sortOrder?: number;

	constructor(fields: {
		id: string;
		name: string;
		parentPath?: string;
		sortOrder?: number;
	}) {
		this.id = fields.id;
		this.name = fields.name;
		this.sortOrder = fields.sortOrder;
		this.parentPath = fields.parentPath;
	}

	static create(fields: {
		name: string;
		parentPath?: string;
		sortOrder?: number;
	}) {
		return new CommandFolder({
			id: uuidv4(),
			name: fields.name,
			parentPath: fields.parentPath,
			sortOrder: fields.sortOrder,
		});
	}

	static fromJson(json: JSONObj): CommandFolder {
		return plainToInstance(CommandFolder, json);
	}

	toJson(): JSONObj {
		return instanceToPlain(this);
	}

	static getWorkspaceFolders(context: ExtensionContext): Array<CommandFolder> {
		const commands =
			context.workspaceState.get<Array<JSONObj>>(COMMAND_FOLDERS_STORAGE_KEY) ??
			[];
		return commands.map((value) => CommandFolder.fromJson(value));
	}
	static getGlobalFolders(context: ExtensionContext): Array<CommandFolder> {
		const commands =
			context.globalState.get<Array<JSONObj>>(COMMAND_FOLDERS_STORAGE_KEY) ??
			[];
		return commands.map((value) => CommandFolder.fromJson(value));
	}
}
