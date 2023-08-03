import cloneDeep from "lodash/cloneDeep";
import { getEntityMetadata } from "../getEntityMetadata";
import { mockTask, mockWorkspaces, mockSpace } from "../../../testing/mocks";

describe("getEntityMetadata", () => {
  test("should return metadata", () => {
    expect(getEntityMetadata(mockTask as never, mockWorkspaces.teams as never, [mockSpace] as never))
      .toStrictEqual({
        id: "task001",
        name: "Link page",
        workspace: "Apps Lab Workspace",
        space: "Team Space",
        folder: "Projects",
        list: "Just a List",
      });
  });

  test("shouldn't show folder", () => {
    const task = cloneDeep(mockTask);
    task.folder.hidden = true;

    expect(getEntityMetadata(task as never, mockWorkspaces.teams as never, [mockSpace] as never))
      .toStrictEqual({
        id: "task001",
        name: "Link page",
        workspace: "Apps Lab Workspace",
        space: "Team Space",
        folder: "",
        list: "Just a List",
      });
  });

  test("shouldn't show workspaces", () => {
    expect(getEntityMetadata(mockTask as never, [] as never, [mockSpace] as never))
      .toStrictEqual({
        id: "task001",
        name: "Link page",
        workspace: "",
        space: "Team Space",
        folder: "Projects",
        list: "Just a List",
      });
  });

  test("shouldn't show space", () => {
    expect(getEntityMetadata(mockTask as never, mockWorkspaces.teams as never))
      .toStrictEqual({
        id: "task001",
        name: "Link page",
        workspace: "Apps Lab Workspace",
        space: "",
        folder: "Projects",
        list: "Just a List",
      });
  });

  test("shouldn't return metadata", () => {
    expect(getEntityMetadata()).toBeUndefined();
  });
});
