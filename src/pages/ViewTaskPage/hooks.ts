import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getTaskService,
  getSpaceService,
  getWorkspacesService,
  getTaskCommentsService,
} from "../../services/clickUp";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Task, Space, Status, Comment, Workspace } from "../../services/clickUp/types";

type UseTask = (taskId?: Task["id"]) => {
  isLoading: boolean,
  task: Maybe<Task>,
  workspaces: Workspace[],
  comments: Comment[],
  statuses: Status[],
};

const useTask: UseTask = (taskId) => {
  const task = useQueryWithClient(
    [QueryKey.TASK, taskId as Task["id"]],
    (client) => getTaskService(client, taskId as Task["id"]),
    { enabled: Boolean(taskId) },
  );

  const comments = useQueryWithClient(
    [QueryKey.TASK_COMMENTS, taskId as Task["id"]],
    (client) => getTaskCommentsService(client, taskId as Task["id"]),
    { enabled: Boolean(taskId) },
  );

  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    (client) => getWorkspacesService(client),
  );

  const space = useQueryWithClient(
    [QueryKey.SPACE, get(task, ["data", "space", "id"]) as Space["id"]],
    (client) => getSpaceService(client, get(task, ["data", "space", "id"]) as Space["id"]),
    { enabled: Boolean(get(task, ["data", "space", "id"])) },
  );

  return {
    isLoading: [task, workspaces, comments, space].some(({ isLoading }) => isLoading),
    task: get(task, ["data"]),
    workspaces: get(workspaces, ["data", "teams"], []) || [],
    comments: get(comments, ["data", "comments"], []) || [],
    statuses: get(space, ["data", "statuses"]) || [],
  }
};

export { useTask };
