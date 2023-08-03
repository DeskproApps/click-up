import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { updateTaskService, updateTaskTagsService } from "../../services/clickUp";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useTask } from "./hooks";
import { getEntityMetadata } from "../../utils";
import { EditTask } from "../../components";
import { getTaskValues, getAssigneesToUpdate, getTagsToUpdate } from "../../components/TaskForm";
import type { FC } from "react";
import type { Maybe, TicketContext } from "../../types";
import type { Workspace, Space } from "../../services/clickUp/types";
import type { FormValidationSchema } from "../../components/TaskForm";

const EditTaskPage: FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const { isLoading, task } = useTask(taskId);
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const onCancel = useCallback(() => {
    if (!taskId) {
      return;
    }

    navigate(`/view/${taskId}`)
  }, [navigate, taskId]);

  const onSubmit = useCallback((
    values: FormValidationSchema,
    workspaces: Array<Pick<Workspace, "id"|"name">>,
    spaces: Array<Pick<Space, "id"|"name">>,
  ) => {
    if (!client || !taskId || !ticketId) {
      return Promise.resolve();
    }

    setError(null);

    const data = { ...getTaskValues(values), assignees: getAssigneesToUpdate(task, values) };

    return updateTaskService(client, taskId, data)
      .then((task) => Promise.all([
        setEntityService(client, ticketId, task.id, getEntityMetadata(task, workspaces, spaces)),
        ...updateTaskTagsService(client, taskId, getTagsToUpdate(task, values)),
      ]))
      .then(() => navigate(`/view/${taskId}`))
      .catch((err) => {
        const error = get(err, ["data", "err"]);

        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, taskId, ticketId, navigate, asyncErrorHandler, task]);

  useSetTitle("Edit Task");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <EditTask
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      task={task}
    />
  );
};

export { EditTaskPage };
