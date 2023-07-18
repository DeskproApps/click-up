import { getTagsToUpdate } from "../utils";

describe("TaskForm", () => {
  describe("getTagsToUpdate", () => {
    test("should return assignees to update", () => {
      expect(getTagsToUpdate(
        { tags: [{ name: "one" }, { name: "two" }] } as never,
        { tags: ["one"] } as never,
      )).toEqual({ add: [], rem: ["two"] });

      expect(getTagsToUpdate(
        { tags: [{ name: "one" }, { name: "two" }] } as never,
        { tags: ["two", "three"] } as never,
      )).toEqual({ add: ["three"], rem: ["one"] });
    });

    test("should return nothing to update", () => {
      expect(getTagsToUpdate(
        { assignees: [] } as never,
        { assignees: [] } as never,
      )).toEqual({ add: [], rem: [] });

      expect(getTagsToUpdate(
        { tags: [{ name: "one" }, { name: "two" }] } as never,
        { tags: ["one", "two"] } as never,
      )).toEqual({ add: [], rem: [] });
    });
  });
});
