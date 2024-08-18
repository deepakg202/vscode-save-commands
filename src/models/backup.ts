import { instanceToPlain, plainToInstance, Type } from "class-transformer";
import type { JSONObj, PickProperties } from "./base_types";
import Command from "./command";
import { CommandFolder } from "./command_folder";

class BackupFields {
	@Type(() => Command)
	commands!: Array<Command>;

	@Type(() => CommandFolder)
	folders!: Array<CommandFolder>;
}

export class BackupModel {
	@Type(() => BackupFields)
	global?: BackupFields;

	@Type(() => BackupFields)
	workspace?: BackupFields;

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
