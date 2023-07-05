import { getOption } from "../getOption";

describe("getOption", () => {
  test("should make a option item", () => {
    expect(getOption("optionID", "optionLabel")).toEqual({
      label: "optionLabel",
      value: "optionID",
      key: "optionID",
      type: "value",
    });
  });
});
