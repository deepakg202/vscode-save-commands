import { plainToClass } from "class-transformer";
import { singleInput as takeSingleInput, uuidv4 } from "../utils";
import { ExtensionContext } from "vscode";
import { PlaceholderType } from "./placeholder_types";
export const COMMAND_STORAGE_KEY = "commands";

export const enum ResolveCommandType {
  runActive = "RUN (Active)",
  runNew = "RUN (New)",
  copy = "COPY",
}

export default class Command {
  id: string;
  name: string;
  command: string;
  placeholderTypeId: string;

  constructor(
    id: string,
    name: string,
    command: string,
    placeholderTypeId: string
  ) {
    this.id = id;
    this.name = name;
    this.command = command;
    this.placeholderTypeId = placeholderTypeId;
  }

  getPlaceholderType(): PlaceholderType {
    return (
      PlaceholderType.getPlaceholderTypeFromId(this.placeholderTypeId) ??
      PlaceholderType.fallbackPlaceholderType
    );
  }

  static create(
    name: string,
    command: string,
    placeholderType: PlaceholderType
  ) {
    const id = uuidv4();
    return new Command(id, name, command, placeholderType.id);
  }

  toJson(): Record<string, string> {
    return {
      id: this.id,
      name: this.name,
      command: this.command,
      placeholderTypeId: this.placeholderTypeId,
    };
  }

  fromJson(json: Record<string, unknown>): Command {
    return new Command(
      json["id"] as string,
      json["name"] as string,
      json["command"] as string,
      json["placeholderTypeId"] as string
    );
  }

  static getWorkspaceCommands(context: ExtensionContext): Array<Command> {
    const commands = (context.workspaceState.get(COMMAND_STORAGE_KEY) ??
      []) as Array<object>;
    return commands.map((value) => plainToClass(Command, value));
  }
  static getGlobalCommands(context: ExtensionContext): Array<Command> {
    const commands = (context.globalState.get(COMMAND_STORAGE_KEY) ??
      []) as Array<object>;
    return commands.map((value) => plainToClass(Command, value));
  }

  async resolveCommand(
    context: ExtensionContext,
    resolveCommandType: ResolveCommandType
  ): Promise<string> {
    const placeholderType = this.getPlaceholderType();
    const regex = placeholderType.regex;
    const matches = this.command.match(regex);
    if (!matches) {
      return this.command;
    }
    const placeholders = matches.map((match) =>
      match.substring(1, match.length - 1)
    );
    const inputs: Record<string, string> = {};
    for (let placeholder of placeholders) {
      const input = await takeSingleInput({
        promptText: `${resolveCommandType} | ${this.name} | ${placeholder} | `,
        placeholder: `Enter ${placeholder}`,
      });
      inputs[placeholder] = input;
    }
    const resolvedCommand = this.command.replace(
      regex,
      (match, placeholder) => {
        if (placeholder in inputs) {
          return inputs[placeholder];
        }
        return match;
      }
    );

    return resolvedCommand;
  }
}
