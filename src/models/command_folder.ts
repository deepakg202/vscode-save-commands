import { instanceToPlain, plainToInstance } from "class-transformer";
import { uuidv4 } from "../utils";
import type { ExtensionContext } from "vscode";
import type { JSONObj, PickProperties } from "./base_types";
export const COMMAND_FOLDERS_STORAGE_KEY = "command_folders";

export class CommandFolder {
	id!: string;
	name!: string;
	parentPath?: string | undefined;
	sortOrder?: number;

	static create(fields: {
		name: string;
		parentPath?: string;
		sortOrder?: number;
	}) {
		return CommandFolder.fromJson({
			id: uuidv4(),
			name: fields.name,
			parentPath: fields.parentPath,
			sortOrder: fields.sortOrder,
		});
	}

	static fromJson(json: JSONObj): CommandFolder {
		return plainToInstance(CommandFolder, json);
	}

	static fromJsonSafe(json: PickProperties<CommandFolder>): CommandFolder {
		return CommandFolder.fromJson(json);
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
