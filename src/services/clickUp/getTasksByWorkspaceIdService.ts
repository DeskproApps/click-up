import { baseRequest } from "./baseRequest";
import { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, Workspace } from "./types";

const getTasksByWorkspaceIdService = (
  client: IDeskproClient,
  workspaceId: Workspace["id"],
) => {
  return baseRequest<{ tasks: Task[], last_page: boolean }>(client, {
    url: `/team/${workspaceId}/task`,
  });
};

export { getTasksByWorkspaceIdService };
