import { useMemo } from "react";
import map from "lodash/map";
import uniq from "lodash/uniq";
import size from "lodash/size";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { getTaskService, getWorkspacesService, getSpaceService } from "../services/clickUp";
import { useQueriesWithClient } from "./useQueriesWithClient";
import { QueryKey } from "../query";
import type { Task, Workspace, Space } from "../services/clickUp/types";
import type { Maybe, Settings, TicketData } from "../types";

type UseLinkedTasks = () => {
  isLoading: boolean;
  tasks: Task[];
  spaces: Space[];
  workspaces: Workspace[];
};

const useLinkedTasks: UseLinkedTasks = () => {
  const { context } = useDeskproLatestAppContext<TicketData, Maybe<Settings>>();
  const ticketId = context?.data?.ticket.id

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS],
    (client) => getEntityListService(client, ticketId ?? ""),
    { enabled: Boolean(ticketId) }
  );

  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    async (client) => {
      const response = await getWorkspacesService(client)

      if(response.success){
        return response.data.teams
      }

      // Ignore auth errors.
      if(response.errorCode === "auth-error"){
        return []
      }

      // Pass other errors to the error boundary.
      throw response.error
    },
  );

  const fetchedTasks = useQueriesWithClient((linkedIds.data ?? []).map((taskId) => ({
    queryKey: [QueryKey.TASK, taskId],
    queryFn: async (client) => {
      const response = await getTaskService(client, taskId)

      if(response.success){
        return response.data
      }

      // Ignore auth errors.
      if(response.errorCode === "auth-error"){
        return null
      }

      // Pass other errors to the error boundary.
      throw response.error
    },
    enabled: Boolean(size(linkedIds)),
    useErrorBoundary: false,
  })));

  const tasks = useMemo(() => {
    return fetchedTasks.map(({ data }) => data).filter(Boolean)
  }, [fetchedTasks]);

  const spaceIds = useMemo(() => uniq(map(tasks, "space.id")), [tasks]);

  const spaces = useQueriesWithClient((spaceIds || []).map((spaceId) => ({
    queryKey: [QueryKey.SPACE, spaceId],
    queryFn: (client) => getSpaceService(client, spaceId),
    enabled: Boolean(size(spaceIds)),
    useErrorBoundary: false,
  })));

  return {
    isLoading: [linkedIds, workspaces, ...fetchedTasks, ...spaces].some(({ isLoading }) => isLoading),
    workspaces: workspaces.data ?? [],
    tasks: tasks as Task[],
    spaces: spaces.map(({ data }) => data).filter(Boolean) as Space[],
  };
};

export { useLinkedTasks };
