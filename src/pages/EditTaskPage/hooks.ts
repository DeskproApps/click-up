import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { QueryKey } from "../../query";
import { getTaskService } from "../../services/clickUp";
import type { Task } from "../../services/clickUp/types";

type UseTask = (taskId?: Task["id"]) => {
  isLoading: boolean,
  task: Task,
};

const useTask: UseTask = (taskId) => {
  const task = useQueryWithClient(
    [QueryKey.TASK, taskId ?? ""],
    async (client) => {
      const response = await getTaskService(client, taskId ?? "")

      if (response.success) {
        return response.data
      }

      // Ignore auth errors.
      if (response.errorCode === "auth-error") {
        return null
      }

      // Pass other errors to the error boundary.
      throw response.error
    },
    { enabled: Boolean(taskId) },
  );

  return {
    isLoading: [task].every(({ isLoading }) => isLoading),
    task: get(task, ["data"]) as Task,
  };
};

export { useTask };
