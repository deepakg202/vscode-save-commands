import { instanceToPlain, plainToInstance } from "class-transformer";
import { singleInput as takeSingleInput, uuidv4 } from "../utils";
import type { ExtensionContext } from "vscode";
import {
	FALLBACK_PLACEHOLDER_TYPE,
	PlaceholderType,
} from "./placeholder_types";
import type { JSONObj, PickProperties } from "./base_types";
export const COMMAND_STORAGE_KEY = "commands";

export enum ResolveCommandType {
	runActive = "RUN (Active)",
	runNew = "RUN (New)",
	copy = "COPY",
}

export default class Command {
	id!: string;
	name!: string;
	command!: string;
	placeholderTypeId!: string;
	path?: string;
	sortOrder?: number;

	getPlaceholderType(): PlaceholderType {
		return (
			PlaceholderType.getPlaceholderTypeFromId(this.placeholderTypeId) ??
			FALLBACK_PLACEHOLDER_TYPE
		);
	}

	static create(
		name: string,
		command: string,
		placeholderType: PlaceholderType,
	) {
		const id = uuidv4();
		return Command.fromJsonSafe({
			id,
			name,
			command,
			placeholderTypeId: placeholderType.id,
			sortOrder: 0,
			path: "",
		});
	}

	toJson(): JSONObj {
		return instanceToPlain(this);
	}

	static fromJson(json: JSONObj): Command {
		return plainToInstance(Command, json);
	}

	static fromJsonSafe(json: PickProperties<Command>): Command {
		return Command.fromJson(json);
	}

	static getWorkspaceCommands(context: ExtensionContext): Array<Command> {
		const commands =
			context.workspaceState.get<Array<JSONObj>>(COMMAND_STORAGE_KEY) ?? [];
		return commands.map((value) => Command.fromJson(value));
	}
	static getGlobalCommands(context: ExtensionContext): Array<Command> {
		const commands =
			context.globalState.get<Array<JSONObj>>(COMMAND_STORAGE_KEY) ?? [];
		return commands.map((value) => Command.fromJson(value));
	}

	async resolveCommand(
		context: ExtensionContext,
		resolveCommandType: ResolveCommandType,
	): Promise<string> {
		const placeholderType = this.getPlaceholderType();
		const regex = placeholderType.regex;
		const matches = placeholderType.extractPlaceholders(this.command);
		if (!matches) {
			return this.command;
		}

		const inputs: Record<string, string> = {};
		for (const placeholder of matches) {
			const input = await takeSingleInput({
				promptText: `${resolveCommandType} | ${this.name} | ${placeholder} | `,
				placeholder: `Enter ${placeholder}`,
			});
			inputs[placeholder] = input;
		}
		const resolvedCommand = this.command.replace(regex, (match) => {
			if (match in inputs) {
				return inputs[match];
			}
			return match;
		});

		return resolvedCommand;
	}
}
