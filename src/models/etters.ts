import type { ExtensionContext, Memento } from "vscode";
import type { JSONObj } from "./base_types";

export enum StateType {
	global = "Global",
	workspace = "Workspace",
}

type Serializable = { toJson: () => JSONObj };

export interface IEtter<T> {
	getValue: (context: ExtensionContext) => T;
	setValue: (context: ExtensionContext, newValue: T) => Thenable<void>;
}

export class ExtensionContextListEtter<T extends Serializable> {
	key: string;
	deserializer: (json: JSONObj) => T;

	constructor(key: string, deserializer: (json: JSONObj) => T) {
		this.key = key;
		this.deserializer = deserializer;
	}

	private getState(context: ExtensionContext, stateType: StateType): Memento {
		switch (stateType) {
			case StateType.global:
				return context.globalState;
			case StateType.workspace:
				return context.workspaceState;
		}
	}

	global: IEtter<Array<T>> = {
		getValue: (context) => {
			return this.getValue(context, StateType.global);
		},
		setValue: (context, newValue) => {
			return this.setValue(context, newValue, StateType.global);
		},
	};

	workspace: IEtter<Array<T>> = {
		getValue: (context) => {
			return this.getValue(context, StateType.workspace);
		},
		setValue: (context, newValue) => {
			return this.setValue(context, newValue, StateType.workspace);
		},
	};

	private getValue(context: ExtensionContext, stateType: StateType): Array<T> {
		const values =
			this.getState(context, stateType).get<Array<JSONObj>>(this.key) ?? [];
		return values.map((value) => this.deserializer(value));
	}

	private async setValue(
		context: ExtensionContext,
		newValue: Array<T>,
		stateType: StateType,
	): Promise<void> {
		await this.getState(context, stateType).update(
			this.key,
			newValue.map((v) => v.toJson()),
		);
		if (stateType === StateType.global) {
			context.globalState.setKeysForSync([this.key]);
		}
	}
}
