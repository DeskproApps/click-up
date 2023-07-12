import { getTaskValues } from "../utils";

const values = {
  workspace: "workspace-001",
  space: "space-001",
  list: "list-001",
  name: "Test task",
  description: "this is description",
  status: "in progress",
  assignee: 123456,
  dueDate: "2023-08-05T21:00:00.000Z",
  tags: ["apps", "sdk"]
};

describe("TaskForm", () => {
  describe("getTaskValues", () => {
    test("should return required values", () => {
      expect(getTaskValues({ list: "list-001", name: "Test task" } as never))
        .toEqual({ listId: "list-001", name: "Test task" });
    });

    test("should return full task values", () => {
      expect(getTaskValues(values as never)).toEqual({
        assignees: [123456],
        description: "this is description",
        listId: "list-001",
        name: "Test task",
        status: "in progress",
        tags: ["apps", "sdk"],
      });
    });
  });
});
