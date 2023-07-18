import { getInitValues } from "../utils";

describe("TaskCommentForm", () => {
  describe("getInitValues", () => {
    test("should return comment values", () => {
      expect(getInitValues()).toEqual({
        comment: "",
        attachments: [],
      });
    });
  });
});
