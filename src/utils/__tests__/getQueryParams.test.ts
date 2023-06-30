import { getQueryParams } from "../getQueryParams";

describe("getQueryParams", () => {
  test.each([
    [undefined, ""],
    ["foo=bar", "?foo=bar"],
    ["?foo=bar", "?foo=bar"],
    [[["type", "success"]], "?type=success"],
    [[["type", "success"], ["foo", "bar"]], "?type=success&foo=bar"],
    [{ type: "error" }, "?type=error"],
    [{ type: "error", armen: "tamzarian" }, "?type=error&armen=tamzarian"],
  ])("should %p", (receive, expected) => {
    expect(getQueryParams(receive as never)).toStrictEqual(expected);
  });
});
