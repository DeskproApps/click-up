import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, User, Status } from "./types";

type Data = {
  name?: Task["name"],
  description?: Task["description"]
  status?: Status["id"],
  assignees?: {
    add: Array<User["id"]>,
    rem: Array<User["id"]>,
  },
  due_date?: Task["due_date"],
};

const updateTaskService = (
  client: IDeskproClient,
  taskId: Task["id"],
  data: Data,
) => {
  return baseRequest<Task>(client, {
    url: `/task/${taskId}`,
    method: "PUT",
    data,
  });
};

export { updateTaskService };
