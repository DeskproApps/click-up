import { noEmptyFormValidator } from "../validators";

describe("TaskCommentForm", () => {
  describe("validators", () => {
    describe("noEmptyFormValidator", () => {
      test("should validation successfully", () => {
        expect(noEmptyFormValidator({ comment: "test", attachments: [] })).toBeTruthy();
        expect(noEmptyFormValidator({ comment: "", attachments: [{}] })).toBeTruthy();
      });

      test("should validation failed", () => {
        expect(noEmptyFormValidator(undefined)).toBeFalsy();
        expect(noEmptyFormValidator({ comment: "" })).toBeFalsy();
        expect(noEmptyFormValidator({ attachments: [] })).toBeFalsy();
        expect(noEmptyFormValidator({ comment: "", attachments: [] })).toBeFalsy();
      });
    });
  });
});
