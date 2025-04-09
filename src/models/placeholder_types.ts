export abstract class PlaceholderType {
	abstract get id(): string;
	abstract get regex(): RegExp;

	abstract wrapLabel(label: string): string;

	extractPlaceholders = (str: string): Record<string, Set<string>> | null => {
		const matches = str.match(this.regex) ?? null;
		if (!matches) return null;
		const placeholders: Record<string, Set<string>> = {}
		matches?.map((m) => {
			const text = m.replace(/^\W+|\W+$/g, '')
			if (!placeholders[text]) {
				placeholders[text] = new Set([m])
			} else {
				placeholders[text].add(m)
			}
		});
		return placeholders;
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
