import { describe, expect, it } from "vitest";
import { formatComplaintCall } from "./formatComplaintCall";

describe("formatComplaintCall", () => {
  it.each([
    [[false], "false"],
    [[true], "true"],
    [[{}], "{}"],
    [[{ inner: {} }], '{"inner":{}}'],
    [[1, "two", [3]], '1, "two", [3]'],
  ])(`formats %p as %p`, (args, expected) => {
    const actual = formatComplaintCall(args);

    expect(actual).toBe(expected);
  });
});
