import { baseRequest } from "./baseRequest";
import { ClickUpError } from "./ClickUpError";
import { Result } from "../../types";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task } from "./types";


export async function getTaskService(client: IDeskproClient, taskId: Task["id"]): Promise<Result<Task>> {

  try {
    const data = await baseRequest<Task>(client, {
      url: `/task/${taskId}`,
      queryParams: { include_subtasks: `${true}` }
    })

    return {
      data,
      success: true
    }
  } catch (e) {

    let errorCode = undefined

    if (e instanceof ClickUpError && e.data.err === "Authorization header required") {
      errorCode = "auth-error" as const
    }

    return {
      success: false,
      message: "Error retrieving task",
      errorCode,
      error: e
    }
  }




}
// const getTaskService = (
//   client: IDeskproClient,
//   taskId: Task["id"],
// ) => {
//   return baseRequest<Task>(client, {
//     url: `/task/${taskId}`,
//     queryParams: { include_subtasks: `${true}` }
//   });
// };

// export { getTaskService };
