import * as vscode from 'vscode';

export const commandInput = async () => {
    try {
        const name = await vscode.window.showInputBox({prompt: 'Command Name', placeHolder: 'Command Name'}) as string;
        const cmd = await vscode.window.showInputBox({prompt: 'Add Command', placeHolder: 'Command'}) as string;
        return Promise.resolve({name: name, cmd: cmd});
    }
    catch(err)
    {
        console.log('Error Adding Command');
        return Promise.reject(Error(err));
    }
};

export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
