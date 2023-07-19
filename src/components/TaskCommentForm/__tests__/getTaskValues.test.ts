import { getValues } from "../utils";

describe("TaskCommentForm", () => {
  describe("getTaskValues", () => {
    test("should return comment values", () => {
      expect(getValues({ comment: "test comment" } as never))
        .toEqual({ comment_text: "test comment" });
    });
  });
});
