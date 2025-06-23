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
    async (client) => {
      const response = await getWorkspacesService(client)

      if (response.success) {
        return response.data.teams
      }

      // Ignore auth errors.
      if (response.errorCode === "auth-error") {
        return []
      }

      // Pass other errors to the error boundary.
      throw response.error

    },
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
    workspaces: workspaces.data ?? [],
    spaces: spaces.data?.spaces ?? [],
    tasks: tasks.data?.tasks?? [],
  };
};

export { useTasks };
