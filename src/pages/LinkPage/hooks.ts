import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getSpacesService,
  getWorkspacesService,
  getTasksByWorkspaceIdService,
} from "../../services/clickUp";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Workspace, Task, Space } from "../../services/clickUp/types";

type UseTasks = (workspaceId: Maybe<Workspace["id"]>) => {
  isLoading: boolean,
  workspaces: Workspace[],
  spaces: Space[],
  tasks: Task[],
};

const useTasks: UseTasks = (workspaceId) => {
  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const spaces = useQueryWithClient(
    [QueryKey.SPACES],
    (client) => getSpacesService(client, workspaceId as Workspace["id"]),
    { enabled: Boolean(workspaceId) }
  );

  const tasks = useQueryWithClient(
    [QueryKey.TASKS_BY_WORKSPACE, workspaceId as Workspace["id"]],
    (client) => getTasksByWorkspaceIdService(client, workspaceId as Workspace["id"]),
    { enabled: Boolean(workspaceId) }
  );

  return {
    isLoading: [workspaces, spaces, tasks].some(({ isLoading }) => isLoading),
    workspaces: get(workspaces, ["data", "teams"], []) || [],
    spaces: get(spaces, ["data", "spaces"], []) || [],
    tasks: get(tasks, ["data", "tasks"], []) || [],
  };
};

export { useTasks };
