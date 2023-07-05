import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task } from "./types";

const getTaskService = (
  client: IDeskproClient,
  taskId: Task["id"],
) => {
  return baseRequest<Task>(client, {
    url: `/task/${taskId}`,
  });
};

export { getTaskService };
