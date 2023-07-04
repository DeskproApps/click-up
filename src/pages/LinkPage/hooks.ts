import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getWorkspacesService,
  getTasksByWorkspaceIdService,
} from "../../services/clickUp";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Workspace, Task } from "../../services/clickUp/types";

type UseTasks = (workspaceId: Maybe<Workspace["id"]>) => {
  isLoading: boolean,
  workspaces: Workspace[],
  tasks: Task[],
};

const useTasks: UseTasks = (workspaceId) => {
  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const tasks = useQueryWithClient(
    [QueryKey.TASKS_BY_WORKSPACE, workspaceId as Workspace["id"]],
    (client) => getTasksByWorkspaceIdService(client, workspaceId as Workspace["id"]),
    { enabled: Boolean(workspaceId) }
  );

  return {
    isLoading: [workspaces, tasks].some(({ isLoading }) => isLoading),
    workspaces: get(workspaces, ["data", "teams"], []) || [],
    tasks: get(tasks, ["data", "tasks"], []) || [],
  };
};

export { useTasks };
