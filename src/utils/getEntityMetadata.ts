import get from "lodash/get";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import type { Task, Workspace, Space } from "../services/clickUp/types";
import type { EntityMetadata } from "../types";

const getEntityMetadata = (
  task?: Task,
  workspaces?: Array<Pick<Workspace, "id"|"name">>,
  spaces?: Array<Pick<Space,"id"|"name">>,
): undefined|EntityMetadata => {
  if (isEmpty(task)) {
    return;
  }

  const workspace = find(workspaces, { id: get(task, ["team_id"]) });
  const space = find(spaces, { id: get(task, ["space", "id"]) });

  return {
    id: get(task, ["id"], ""),
    name: get(task, ["name"], ""),
    workspace: get(workspace, ["name"], ""),
    space: get(space, ["name"], ""),
    folder: get(task, ["folder", "hidden"])
      ? ""
      : get(task, ["folder", "name"], ""),
    list: get(task, ["list", "name"] , ""),
  };
};

export { getEntityMetadata };
