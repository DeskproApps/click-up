import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { CreatedComment, Task, User } from "./types";

type Data = {
  comment_text: string,
  assignee?: User["id"],
  notify_all?: boolean,
};

const createTaskCommentService = (
  client: IDeskproClient,
  taskId: Task["id"],
  data: Data,
) => {
  return baseRequest<CreatedComment>(client, {
    method: "POST",
    url: `/task/${taskId}/comment`,
    data,
  });
};

export { createTaskCommentService };
