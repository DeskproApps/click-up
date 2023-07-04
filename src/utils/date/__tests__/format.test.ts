import { format } from "../format";

describe("date", () => {
  describe("format", () => {
    test("should return empty date", () => {
      expect(format(null)).toEqual("-");
    });

    test("shouldn't return date if pass date as ISO string", () => {
      expect(format("2023-06-30T21:00:00.000Z"))
        .toEqual("-");
    });

    test("should return date if pass date as Date", () => {
      expect(format("1688105684073"))
        .toEqual("30 Jun, 2023");
    });

    test.each([
      undefined, null, "", 0, true, false, {}, "-"]
    )("wrong value: %p", (value) => {
      expect(format(value as never)).toEqual("-");
    });
  });
});
