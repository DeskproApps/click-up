import { parse } from "../parse";

describe("date", () => {
  describe("parse", () => {
    test("should return Date", () => {
      expect(parse("1688566222554")).toEqual(new Date("2023-07-05T14:10:22.554Z"));
    });

    test.each([
      undefined, null, "", 0, true, false, {}, "-"]
    )("wrong value: %p", (value) => {
      expect(parse(value as never)).toBeUndefined();
    });
  });
});
