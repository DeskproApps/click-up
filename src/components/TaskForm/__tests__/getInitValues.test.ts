import { getInitValues } from "../utils";

describe("TaskForm", () => {
  describe("getInitValues", () => {
    test("should return initial values", () => {
      expect(getInitValues()).toEqual({
        workspace: "",
        space: "",
        list: "",
        name: "",
        description: "",
        status: "",
        assignees: [],
        dueDate: undefined,
        tags: [],
      });
    });
  });
});
