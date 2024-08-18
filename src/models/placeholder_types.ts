export abstract class PlaceholderType {
	abstract get id(): string;
	abstract get regex(): RegExp;

	abstract wrapLabel(label: string): string;

	extractPlaceholders = (str: string): Array<string> | null => {
		return str.match(this.regex);
	};

	static getPlaceholderTypeFromId(id: string) {
		return ALL_PLACEHOLDERS.find((i) => i.id === id);
	}
}

export class SingleCurlyBracesPlaceholderType extends PlaceholderType {
	wrapLabel(label: string): string {
		return `{${label}}`;
	}
	get id(): string {
		return "singleCurlyBraces";
	}
	get regex(): RegExp {
		return /{([^}]+)}/g;
	}
}

class DoubleCurlyBracesPlaceholderType extends PlaceholderType {
	wrapLabel(label: string): string {
		return `{{${label}}}`;
	}
	get id(): string {
		return "doubleCurlyBraces";
	}
	get regex(): RegExp {
		return /{{([^}]+)}}/g;
	}
}

class SingleAngleBracesPlaceholderType extends PlaceholderType {
	wrapLabel(label: string): string {
		return `<${label}>`;
	}
	get id(): string {
		return "singleAngleBraces";
	}
	get regex(): RegExp {
		return /<([^>]+)>/g;
	}
}

class DoubleAngleBracesPlaceholderType extends PlaceholderType {
	wrapLabel(label: string): string {
		return `<<${label}>>`;
	}
	get id(): string {
		return "doubleAngleBraces";
	}
	get regex(): RegExp {
		return /<<([^>>]+)>>/g;
	}
}

export const ALL_PLACEHOLDERS = [
	new SingleCurlyBracesPlaceholderType(),
	new DoubleCurlyBracesPlaceholderType(),
	new SingleAngleBracesPlaceholderType(),
	new DoubleAngleBracesPlaceholderType(),
];

export const FALLBACK_PLACEHOLDER_TYPE = new SingleCurlyBracesPlaceholderType();
