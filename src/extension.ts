import * as vscode from 'vscode';
import * as utils from './utils';
import TreeDataProvider from './TreeProvider';
import TreeItem from './TreeItem';

const terminals: Array<vscode.Terminal> = [];

export function activate(context: vscode.ExtensionContext) {
	const treeView = new TreeDataProvider(context);
	const addCommand = vscode.commands.registerCommand('save-commands.addCommand', function () {
		vscode.window.showWarningMessage('Add Workspace Command');
		utils.commandInput().then((val: any) => {
			let c = context.workspaceState.get('commands') as Array<object> || [];
			const id = utils.uuidv4() as string;
			c.push({ id: id, name: val.name, command: val.cmd });
			context.workspaceState.update('commands', c);
			vscode.window.showInformationMessage('Added Workspace Command Successfully');
			vscode.commands.executeCommand('save-commands.refreshView');
		}).catch((e: any) => {
			vscode.window.showErrorMessage('Error Adding Command');
			console.error(e);
		});
	});
	const addGlobalCommand = vscode.commands.registerCommand('save-commands.addGlobalCommand', function () {
		vscode.window.showWarningMessage('Add Global Command');
		utils.commandInput().then((val: any) => {
			let c = context.globalState.get('commands') as Array<object> || [];
			const id = utils.uuidv4() as string;
			c.push({ id: id, name: val.name, command: val.cmd });
			context.globalState.update('commands', c);
			context.globalState.setKeysForSync(['commands']);
			vscode.window.showInformationMessage('Added Global Command Successfully');
			vscode.commands.executeCommand('save-commands.refreshView');
		}).catch((e: any) => {
			vscode.window.showErrorMessage('Error Adding Command');
			console.error(e);
		});
	});

	const deleteWorkspace = vscode.commands.registerCommand('save-commands.deleteWorkspaceCommands', () => {
		const commands = context.workspaceState.get('commands');
		if((!commands || (commands as Array<any>).length === 0)) {
			return;
		}
		utils.confirmationDialog({
			onConfirm: () => {
				context.workspaceState.update('commands', []);
				vscode.commands.executeCommand('save-commands.refreshView');
				vscode.window.showInformationMessage('Workspace Commands Deleted');		
			},
			message: "Are you sure you want to delete all workspace commands ?"
		});
	});
	const deleteGlobal = vscode.commands.registerCommand('save-commands.deleteGlobalCommands', () => {
		const commands = context.globalState.get('commands');
		if((!commands || (commands as Array<any>).length === 0)) {
			return;
		}
		utils.confirmationDialog({
			onConfirm: () => {
				context.globalState.update('commands', []);
				vscode.commands.executeCommand('save-commands.refreshView');
				vscode.window.showInformationMessage('Global Commands Deleted');		
			},
			message: "Are you sure you want to delete all global commands ?"
		});
	});

	const deleteCommand = vscode.commands.registerCommand('save-commands.deleteCommand', (item: TreeItem) => {
		utils.confirmationDialog({
			onConfirm: () => {
				if (item.contextValue === 'child-global') {
					let c = context.globalState.get('commands') as Array<object> || [];
					const i = c.findIndex((d: any) => d.id === item.cmdId);
					if (i > -1) { c.splice(i, 1); }
					context.globalState.update('commands', c);
				}
				else if (item.contextValue === 'child-workspace') {
					let c = context.workspaceState.get('commands') as Array<object> || [];
					const i = c.findIndex((d: any) => d.id === item.cmdId);
					if (i > -1) { c.splice(i, 1); }
					context.workspaceState.update('commands', c);
				}
				vscode.commands.executeCommand('save-commands.refreshView');		
			},
			message: "Are you sure you want to delete the command ?"
		});

	});

	const editCommand = vscode.commands.registerCommand('save-commands.editCommand', (item: TreeItem) => {
		let c: any;
		try {
			if (item.contextValue === 'child-workspace') {
				c = context.workspaceState.get('commands') as Array<object> || [];
			}
			else if (item.contextValue === 'child-global') {
				c = context.globalState.get('commands') as Array<object> || [];
			}
			const i = c.findIndex((d: any) => d.id === item.cmdId);
			if (i > -1) {
				utils.commandInput({ name: c[i].name, cmd: c[i].command }).then((val) => {
					c[i].name = val.name;
					c[i].command = val.cmd;
					if (item.contextValue === 'child-workspace') {
						context.workspaceState.update('commands', c);
					}
					else if (item.contextValue === 'child-global') {
						context.globalState.update('commands', c);
					}
					vscode.commands.executeCommand('save-commands.refreshView');
				});
			}
			else {
				throw Error('Unable to find the command in state');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Unable to execute the command');
		}
	});

	const copyCommand = vscode.commands.registerCommand('save-commands.copyCommand', (item: TreeItem) => {
		let c: any;
		try {
			if (item.contextValue === 'child-workspace') {
				c = context.workspaceState.get('commands') as Array<object> || [];
			}
			else if (item.contextValue === 'child-global') {
				c = context.globalState.get('commands') as Array<object> || [];
			}
			const i = c.findIndex((d: any) => d.id === item.cmdId);
			if (i > -1) {
				vscode.env.clipboard.writeText(c[i].command);
				vscode.window.showInformationMessage(`${c[i].name} Command Copied to Clipboard`);
			}
			else {
				throw Error('Unable to find the command in state');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Unable to execute the command');
		}
	});

	const runCommand = vscode.commands.registerCommand('save-commands.runCommand', (item: TreeItem) => {
		let c: any;
		try {
			if (item.contextValue === 'child-workspace') {
				c = context.workspaceState.get('commands') as Array<object> || [];
			}
			else if (item.contextValue === 'child-global') {
				c = context.globalState.get('commands') as Array<object> || [];
			}
			const i = c.findIndex((d: any) => d.id === item.cmdId);
			if (i > -1) {
				const terminalId = `${c[i].name}-${utils.generateString(5)}`;
				const terminal = vscode.window.createTerminal(terminalId);
				terminal.sendText(c[i].command);
				terminal.show();
			}
			else {
				throw Error('Unable to find the command in state');
			}
		} catch (e) {
			vscode.window.showErrorMessage('Unable to execute the command');
		}
	});
	const reset = vscode.commands.registerCommand('save-commands.reset', () => {
		utils.confirmationDialog({
			onConfirm: () => {
				context.workspaceState.update('commands', []);
				context.globalState.update('commands', []);
				vscode.commands.executeCommand('save-commands.refreshView');		
			},
			message: "Are you sure you want to delete all saved commands ?"
		});
	});

	const refreshView = vscode.commands.registerCommand('save-commands.refreshView', () => {
		treeView.refresh();
	});

	vscode.window.registerTreeDataProvider('save-commands-view', treeView);
	context.subscriptions.push(addCommand, addGlobalCommand);
	context.subscriptions.push(deleteWorkspace, deleteGlobal);
	context.subscriptions.push(deleteCommand, runCommand, copyCommand, editCommand);
	context.subscriptions.push(refreshView, reset);
}

// this method is called when your extension is deactivated
export function deactivate() { terminals.forEach((terminal) => terminal.dispose()); }
