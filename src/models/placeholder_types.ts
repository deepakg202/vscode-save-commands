import * as vscode from "vscode";
class SingleCurlyBracesPlaceholderType implements PlaceholderType {
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

class DoubleCurlyBracesPlaceholderType implements PlaceholderType {
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

class SingleAngleBracesPlaceholderType implements PlaceholderType {
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

class DoubleAngleBracesPlaceholderType implements PlaceholderType {
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

export abstract class PlaceholderType {
  abstract get id(): string;
  abstract get regex(): RegExp;

  abstract wrapLabel(label: string): string;

  static all: Array<PlaceholderType> = [
    new SingleCurlyBracesPlaceholderType(),
    new DoubleCurlyBracesPlaceholderType(),
    new SingleAngleBracesPlaceholderType(),
    new DoubleAngleBracesPlaceholderType(),
  ];

  static fallbackPlaceholderType = new SingleCurlyBracesPlaceholderType();

  static getPlaceholderTypeFromId(id: string) {
    return this.all.find((i) => i.id === id);
  }

  static getActivePlaceholderType(): PlaceholderType {
    const config = vscode.workspace.getConfiguration("save-commands");

    return (
      this.all.find((i) => i.id === config.get("placeholderType")) ??
      this.all[2]
    );
  }
}
