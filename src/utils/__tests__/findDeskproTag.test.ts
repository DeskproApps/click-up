import { findDeskproTag } from "../findDeskproTag";

const dpTag = { id: "000", name: "Deskpro" };

const tags = [
  { id: "001", name: "MVP" },
  { id: "002", name: "test" },
  { id: "003",  name: "" },
];

describe("findDeskproTag", () => {
  test("should return Deskpro Tag", () => {
    expect(findDeskproTag([dpTag] as never)).toEqual(dpTag);
    expect(findDeskproTag([...tags, dpTag] as never)).toEqual(dpTag);
  });

  describe("should return undefined if Deskpro Tag not exist", () => {
    test("", () => {
      expect(findDeskproTag([
        { id: "001", name: "MVP" },
        { id: "002", name: "test" },
        { id: "003",  name: "" },
      ] as never)).toBeUndefined();
    });

    test.each(
      [undefined, null, "", 0, true, false, {}, []]
    )("wrong value %p", (value) => {
      expect(findDeskproTag(value as never)).toBeUndefined();
    });
  });
});
