import * as vscode from "vscode";
import ReadableError from "./models/error";

enum Decision {
  yes = "Yes",
  no = "No",
}

enum InputFieldType {
  label = "Label",
  command = "Command",
}

export enum CommandInputType {
  edit,
  addGlobal,
  addWorkspace = "Workspace",
}

export const singleInput = async (options: {
  promptText: string;
  placeholder: string;
}): Promise<string> => {
  const { promptText, placeholder } = options;
  try {
    const str = await vscode.window.showInputBox({
      prompt: promptText,
      placeHolder: placeholder,
      value: "",
    });

    if (!str) {
      throw new ReadableError("No Input Captured");
    }
    return str;
  } catch (err) {
    throw new ReadableError("Error taking input");
  }
};

const getCommandInputTypeLabel = (
  inputType: CommandInputType,
  inputField: InputFieldType,
  defaults?: {
    name?: string;
    cmd?: string;
  }
): string => {
  switch (inputType) {
    case CommandInputType.addGlobal:
      return `ADD | Scope: Global | ${inputField}`;
    case CommandInputType.addWorkspace:
      return `ADD | Scope: Workspace | ${inputField}`;
    case CommandInputType.edit:
      return `EDIT | ${defaults?.name ?? ""} | ${inputField}`;
    default:
      return "";
  }
};

export const commandInput = async (
  inputType: CommandInputType,
  defaults?: {
    name?: string;
    cmd?: string;
  }
) => {
  try {
    const name = (await vscode.window.showInputBox({
      prompt: getCommandInputTypeLabel(
        inputType,
        InputFieldType.label,
        defaults
      ),
      placeHolder: "Label",
      value: defaults?.name || undefined,
    })) as string;
    const cmd = (await vscode.window.showInputBox({
      prompt: getCommandInputTypeLabel(
        inputType,
        InputFieldType.command,
        defaults
      ),
      placeHolder: "Command Eg: `prog.sh -i {arg1} {arg2}`",
      value: defaults?.cmd || undefined,
    })) as string;
    if (!name.trim() || !cmd.trim()) {
      throw new Error("Bad Input");
    }
    return Promise.resolve({ name: name.trim(), cmd: cmd.trim() });
  } catch (err) {
    console.log("Error Adding Command");
    return Promise.reject(err);
  }
};

export const uuidv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateString = (length: number): string => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const confirmationDialog = (args: ConfirmationArgs) => {
  vscode.window
    .showInformationMessage(
      args.message ?? "Are you sure you want to do this?",
      Decision.yes,
      Decision.no
    )
    .then((ans) => {
      if (ans === Decision.yes) {
        args.onConfirm();
      } else {
        if (args.onReject) {
          args.onReject();
        }
      }
    });
};

interface ConfirmationArgs {
  onConfirm: Function;
  onReject?: Function;
  message?: string;
}
