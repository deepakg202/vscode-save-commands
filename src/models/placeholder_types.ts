import * as vscode from "vscode";
class SingleCurlyBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "singleCurlyBraces";
  }
  get regex(): RegExp {
    return /{([^}]+)}/g;
  }
}

class DoubleCurlyBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "doubleCurlyBraces";
  }
  get regex(): RegExp {
    return /{{([^}]+)}}/g;
  }
}

class SingleAngleBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "singleAngleBraces";
  }
  get regex(): RegExp {
    throw new Error("Method not implemented.");
  }
}

class DoubleAngleBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "doubleAngleBraces";
  }
  get regex(): RegExp {
    throw new Error("Method not implemented.");
  }
}

class SingleSquareBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "singleSquareBraces";
  }
  get regex(): RegExp {
    throw new Error("Method not implemented.");
  }
}

class DoubleSquareBracesPlaceholderType implements PlaceholderType {
  get id(): string {
    return "doubleSquareBraces";
  }
  get regex(): RegExp {
    throw new Error("Method not implemented.");
  }
}

export abstract class PlaceholderType {
  abstract get id(): string;
  abstract get regex(): RegExp;

  static all: Array<PlaceholderType> = [
    new SingleCurlyBracesPlaceholderType(),
    new DoubleCurlyBracesPlaceholderType(),
    new SingleAngleBracesPlaceholderType(),
    new DoubleAngleBracesPlaceholderType(),
    new SingleSquareBracesPlaceholderType(),
    new DoubleSquareBracesPlaceholderType(),
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
