import { instanceToPlain, plainToInstance } from "class-transformer";
import type { JSONObj, PickProperties } from "./base_types";
import type Command from "./command";
import type { CommandFolder } from "./command_folder";

export class BackupModel {
	global?: {
		commands: Array<Command>;
		folders: Array<CommandFolder>;
	};
	workspace?: {
		commands: Array<Command>;
		folders: Array<CommandFolder>;
	};

	toJson(): JSONObj {
		return instanceToPlain(this);
	}

	static fromJson(json: JSONObj): BackupModel {
		return plainToInstance(BackupModel, json);
	}

	static fromJsonSafe(json: PickProperties<BackupModel>): BackupModel {
		return BackupModel.fromJson(json);
	}
}
