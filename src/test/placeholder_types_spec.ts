import { ALL_PLACEHOLDERS, PlaceholderType } from "../models/placeholder_types";
import assert = require("assert");

describe("PlaceholderType Tests", () => {
  const generatePlaceholderCommand = (
    placeholderType: PlaceholderType
  ): string => {
    return `Your test command with ${placeholderType.wrapLabel(
      "label1"
    )} and ${placeholderType.wrapLabel("label2")}`;
  };

  const generateInput = (placeholderType: PlaceholderType) =>
    ({
      [placeholderType.wrapLabel("label1")]: "replacement1",
      [placeholderType.wrapLabel("label2")]: "replacement2",
    } as Record<string, string>);

  ALL_PLACEHOLDERS.forEach((placeholderType) => {
    const input = generateInput(placeholderType);
    const label1 = input[placeholderType.wrapLabel("label1")];
    const label2 = input[placeholderType.wrapLabel("label2")];

    const updatedCommand = `Your test command with ${label1} and ${label2}`;

    it(`Should replace placeholders correctly for placeholder ${placeholderType.id}`, () => {
      const regex = placeholderType.regex;

      const command = generatePlaceholderCommand(placeholderType);

      const matches = placeholderType.extractPlaceholders(command);

      assert.equal(
        JSON.stringify([
          placeholderType.wrapLabel("label1"),
          placeholderType.wrapLabel("label2"),
        ]),
        JSON.stringify(matches),
        "Placeholders not matching on extract"
      );

      const replacedCommand = command.replace(regex, (match) => {
        if (match in input) {
          return input[match];
        }
        return match;
      });

      assert.equal(replacedCommand, updatedCommand, "Outputs do not match");
    });
  });
});
