import { plainToClass } from "class-transformer";
import { singleInput as takeSingleInput, uuidv4 } from "../utils";
import { ExtensionContext } from "vscode";
export const COMMAND_STORAGE_KEY = "commands";

export default class Command {
  id: string;
  name: string;
  command: string;

  constructor(id: string, name: string, command: string) {
    this.id = id;
    this.name = name;
    this.command = command;
  }

  static create(name: string, command: string) {
    const id = uuidv4();
    return new Command(id, name, command);
  }

  toJson(): Record<string, string> {
    return {
      id: this.id,
      name: this.name,
      command: this.command,
    };
  }

  fromJson(json: Record<string, unknown>): Command {
    return new Command(
      json["id"] as string,
      json["name"] as string,
      json["command"] as string
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

  async resolveCommand(context: ExtensionContext): Promise<string> {
    const regex = /{([^}]+)}/g;
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
        promptText: `Take input for ${placeholder}`,
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
