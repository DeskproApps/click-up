import { useState, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { createTaskService } from "../../services/clickUp";
import { setEntityService } from "../../services/deskpro";
import { useSetTitle, useAsyncError, useLinkedAutoComment, useDeskproTag } from "../../hooks";
import { getEntityMetadata } from "../../utils";
import { CreateTask } from "../../components";
import { getTaskValues, getListId } from "../../components/TaskForm";
import type { FC } from "react";
import type { Maybe, Settings, TicketData } from "../../types";
import type { Workspace, Space } from "../../services/clickUp/types";
import type { FormValidationSchema } from "../../components/TaskForm";

const CreateTaskPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Maybe<Settings>>();
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkComment } = useLinkedAutoComment();
  const { addDeskproTag } = useDeskproTag();
  const [error, setError] = useState<Maybe<string | string[]>>(null);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const onNavigateToLinkTask = useCallback(() => navigate("/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit = useCallback((
    values: FormValidationSchema,
    workspaces: Array<Pick<Workspace, "id" | "name">>,
    spaces: Array<Pick<Space, "id" | "name">>,
  ) => {
    if (!client || !ticketId) {
      return Promise.resolve();
    }

    setError(null);

    return createTaskService(client, getListId(values), getTaskValues(values))
      .then((task) => Promise.all([
        setEntityService(client, ticketId, task.id, getEntityMetadata(task, workspaces, spaces)),
        addLinkComment(task.id),
        addDeskproTag(task),

      ]))
      .then(() => navigate("/home"))
      .catch((err) => {
        const error = get(err, ["data", "err"]);

        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, ticketId, addLinkComment, addDeskproTag, navigate, asyncErrorHandler]);

  useSetTitle("Link Tasks");

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <CreateTask
      onSubmit={onSubmit}
      error={error}
      onCancel={onCancel}
      onNavigateToLinkTask={onNavigateToLinkTask}
    />
  );
};

export { CreateTaskPage };
