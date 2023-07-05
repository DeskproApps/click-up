import { getFilteredTasks } from "../getFilteredTasks";

describe("getFilteredTasks", () => {
  test("should return empty task list if empty tasks", () => {
    expect(getFilteredTasks([], {})).toStrictEqual([]);
  });

  test("should return filtered tasks by title", () => {
    expect(getFilteredTasks([
      { id: "task001", name: "Link page" },
      { id: "task002", name: "Home page" },
      { id: "task003", name: "View page" },
    ] as never, { query: "link" })).toEqual([
      { id: "task001", name: "Link page" },
    ]);
  });

  test("should return filtered tasks by taskId", () => {
    expect(getFilteredTasks([
      { id: "task001", name: "Link page" },
      { id: "task002", name: "Home page" },
      { id: "task003", name: "View page" },
    ] as never, { query: "task002" })).toEqual([
      { id: "task002", name: "Home page" },
    ]);
  });
});
