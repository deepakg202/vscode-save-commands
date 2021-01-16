import * as vscode from 'vscode';
import * as utils from './utils';
import TreeDataProvider from './treeProvider';
import { createBrotliCompress } from 'zlib';
export function activate(context: vscode.ExtensionContext) {
	const treeView = new TreeDataProvider(context);
	const addCommand = vscode.commands.registerCommand('save-commands.addCommand', function () {
		vscode.window.showWarningMessage('Add Workspace Command');
		utils.commandInput().then((val:any) => {
			let c = context.workspaceState.get('commands') as Array<object> || [];
			
			const id = utils.uuidv4() as string;
			c.push({id: id, name: val.name, command: val.cmd});
			context.workspaceState.update('commands', c);
			vscode.window.showInformationMessage('Added Workspace Command Successfully');	
			treeView.refresh();
		}).catch((e: any) => {
			vscode.window.showErrorMessage('Error Adding Command');
			console.log(e);
		});
	});
	const addGlobalCommand = vscode.commands.registerCommand('save-commands.addGlobalCommand', function () {
		vscode.window.showWarningMessage('Add Global Command');
		utils.commandInput().then((val:any) => {
			let c = context.globalState.get('commands') as Array<object> || [];
			console.log(context.globalState);
			const id = utils.uuidv4() as string;
			c.push({id: id, name: val.name, command: val.cmd});
			context.globalState.update('commands', c);
			vscode.window.showInformationMessage('Added Global Command Successfully');	
			treeView.refresh();
		}).catch((e: any) => {
			vscode.window.showErrorMessage('Error Adding Command');
			console.log(e);
		});
	});
	vscode.window.registerTreeDataProvider('save-commands-view', treeView);
	context.subscriptions.push(addCommand, addGlobalCommand);
	context.subscriptions.push(addGlobalCommand);	
	
}

// this method is called when your extension is deactivated
export function deactivate() {}
