import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, Attachment } from "./types";

const createTaskAttachmentService = (
  client: IDeskproClient,
  taskId: Task["id"],
  data: FormData,
) => {
  return baseRequest<Attachment>(client, {
    url: `/task/${taskId}/attachment`,
    method: "POST",
    data
  });
};

export { createTaskAttachmentService };
