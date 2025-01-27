import { useState, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../services/deskpro";
import { useAsyncError } from "./useAsyncError";
import { useLinkedAutoComment } from "./useLinkedAutoComment";
import { useReplyBox } from "./useReplyBox";
import { useDeskproTag } from "./useDeskproTag";
import type { TicketContext } from "../types";
import type { Task } from "../services/clickUp/types";

export type Result = {
  isLoading: boolean,
  unlink: (task: Task) => void,
};

const useUnlinkTask = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const { addUnlinkComment } = useLinkedAutoComment();
  const { removeDeskproTag } = useDeskproTag();
  const { deleteSelectionState } = useReplyBox();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const unlink = useCallback((task?: Task) => {
    if (!client || isEmpty(task) || !ticketId) {
      return;
    }

    setIsLoading(true);
    Promise.all([
      deleteEntityService(client, ticketId, task.id),
      addUnlinkComment(task.id),
      removeDeskproTag(task),
      deleteSelectionState(task.id, "note"),
      deleteSelectionState(task.id, "email"),
    ])
      .then(() => {
        setIsLoading(false);
        navigate("/home");
      })
      .catch(asyncErrorHandler);
  }, [client, ticketId, navigate, asyncErrorHandler, addUnlinkComment, deleteSelectionState, removeDeskproTag]);

  return { isLoading, unlink };
};

export { useUnlinkTask };
