import * as vscode from "vscode";

enum Decision {
  yes = "Yes",
  no = "No",
}

export const commandInput = async (defaults?: any) => {
  try {
    const name = (await vscode.window.showInputBox({
      prompt: "Command Name",
      placeHolder: "Command Name",
      value: defaults?.name || undefined,
    })) as string;
    const cmd = (await vscode.window.showInputBox({
      prompt: "Add Command",
      placeHolder: "Command",
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

export const uuidv4 = () => {
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
        if (args.onReject) {args.onReject();}
      }
    });
};

interface ConfirmationArgs {
  onConfirm: Function;
  onReject?: Function;
  message?: string;
}
