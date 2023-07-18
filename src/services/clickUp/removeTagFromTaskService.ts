import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, Tag } from "./types";

const removeTagFromTaskService = (
  client: IDeskproClient,
  taskId: Task["id"],
  tagName: Tag["name"],
) => {
  return baseRequest<void>(client, {
    url: `/task/${taskId}/tag/${tagName}`,
    method: "DELETE",
  });
};

export { removeTagFromTaskService };
