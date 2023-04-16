import { uuidv4 } from "../utils";
import { ExtensionContext } from "vscode";
export const COMMAND_STORAGE_KEY = "commands";

export default class Command {
  id: string;
  name: string;
  command: string;

  constructor(name: string, command: string) {
    this.id = uuidv4();
    this.name = name;
    this.command = command;
  }

  toJson(): Record<string, string> {
    return {
      id: this.id,
      name: this.name,
      command: this.command,
    };
  }

  static getWorkspaceCommands(context: ExtensionContext): Array<Command> {
    return (
      (context.workspaceState.get(COMMAND_STORAGE_KEY) as Array<Command>) ?? []
    );
  }
  static getGlobalCommands(context: ExtensionContext): Array<Command> {
    return (
      (context.workspaceState.get(COMMAND_STORAGE_KEY) as Array<Command>) ?? []
    );
  }
}
