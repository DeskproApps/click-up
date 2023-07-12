import { getTaskValues } from "../utils";
import values from "./mockFormValues.json";

describe("TaskForm", () => {
  describe("getTaskValues", () => {
    test("should return required values", () => {
      expect(getTaskValues({ list: "list-001", name: "Test task" } as never))
        .toEqual({ name: "Test task" });
    });

    test("should return full task values", () => {
      expect(getTaskValues(values as never)).toEqual({
        assignees: [123456],
        description: "this is description",
        name: "Test task",
        status: "in progress",
        tags: ["apps", "sdk"],
      });
    });
  });
});
