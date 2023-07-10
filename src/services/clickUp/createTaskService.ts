import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, List } from "./types";

const createTaskService = (
  client: IDeskproClient,
  listId: List["id"],
  data: object,
) => {
  return baseRequest<Task>(client, {
    url: `/list/${listId}/task`,
    method: "POST",
    data,
  });
};

export { createTaskService };
