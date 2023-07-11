import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, Comment } from "./types";

const getTaskCommentsService = (
  client: IDeskproClient,
  taskId: Task["id"],
) => {
  return baseRequest<{ comments: Comment[] }>(client, {
    url: `/task/${taskId}/comment`,
  });
};

export { getTaskCommentsService };
