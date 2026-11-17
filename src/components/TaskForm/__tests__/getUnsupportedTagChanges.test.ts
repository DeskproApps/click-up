import { getUnsupportedTagChanges } from "../utils";

describe("TaskForm", () => {
  describe("getUnsupportedTagChanges", () => {
    test("should return added or removed tags containing a slash", () => {
      expect(getUnsupportedTagChanges({
        add: ["needs review/QA #1", "needs review #2"],
        rem: ["qa/slash", "plain"],
      })).toEqual(["needs review/QA #1", "qa/slash"]);
    });

    test("should return nothing when every tag change is supported", () => {
      expect(getUnsupportedTagChanges({ add: ["needs review #2"], rem: [] })).toEqual([]);
      expect(getUnsupportedTagChanges({ add: [], rem: [] })).toEqual([]);
    });
  });
});
