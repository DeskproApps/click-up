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
import type { TicketContext } from "../types";

type UseLinkedTasks = () => {
  isLoading: boolean;
  tasks: Task[];
  spaces: Space[];
  workspaces: Workspace[];
};

const useLinkedTasks: UseLinkedTasks = () => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = context.data?.ticket.id

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS],
    (client) => getEntityListService(client, ticketId ?? ""),
    { enabled: Boolean(ticketId) }
  );

  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const fetchedTasks = useQueriesWithClient((linkedIds.data ?? []).map((taskId) => ({
    queryKey: [QueryKey.TASK, taskId],
    queryFn: (client) => getTaskService(client, taskId),
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
    workspaces: workspaces.data?.teams ?? [],
    tasks: tasks as Task[],
    spaces: spaces.map(({ data }) => data).filter(Boolean) as Space[],
  };
};

export { useLinkedTasks };
