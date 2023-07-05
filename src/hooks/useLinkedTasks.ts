import get from "lodash/get";
import size from "lodash/size";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { getTaskService, getWorkspacesService } from "../services/clickUp";
import { useQueriesWithClient } from "./useQueriesWithClient";
import { QueryKey } from "../query";
import type { Task, Workspace } from "../services/clickUp/types";
import type { TicketContext } from "../types";

type UseLinkedTasks = () => {
  isLoading: boolean;
  tasks: Task[];
  workspaces: Workspace[];
};

const useLinkedTasks: UseLinkedTasks = () => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = get(context, ["data", "ticket", "id"]);

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS],
    (client) => getEntityListService(client, ticketId),
    { enabled: Boolean(ticketId) }
  );

  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const tasks = useQueriesWithClient((get(linkedIds, ["data"], []) || []).map((taskId) => ({
    queryKey: [QueryKey.TASK, taskId],
    queryFn: (client) => getTaskService(client, taskId),
    enabled: Boolean(size(linkedIds)),
    useErrorBoundary: false,
  })));

  return {
    isLoading: [linkedIds, workspaces, ...tasks].some(({ isLoading }) => isLoading),
    workspaces: get(workspaces, ["data", "teams"], []) || [],
    tasks: tasks.map(({ data }) => data).filter(Boolean) as Task[],
  };
};

export { useLinkedTasks };
