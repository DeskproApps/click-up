import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { editChecklistItemService } from "../../services/clickUp";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useTask } from "./hooks";
import { queryClient } from "../../query";
import { ViewTask } from "../../components";
import type { FC } from "react";
import type { CheckList, CheckListItem } from "../../services/clickUp/types";

const ViewTaskPage: FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const { task, workspaces, comments, statuses, space, isLoading } = useTask(taskId);

  const onNavigateToAddComment = useCallback(() => {
    navigate(`/view/${taskId}/comments/new`);
  }, [navigate, taskId]);

  const onCompleteChecklist = useCallback((
    checklistId: CheckList["id"],
    itemId: CheckListItem["id"],
    resolved: boolean,
  ) => {
    if (!client) {
      return Promise.resolve();
    }

    return editChecklistItemService(client, checklistId, itemId, resolved)
      .then(() => queryClient.invalidateQueries())
      .catch(asyncErrorHandler);
  }, [client, asyncErrorHandler]);

  useSetTitle("ClickUp");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    registerElement("edit", {
      type: "edit_button",
      payload: { type: "changePage", path: `/edit/${taskId}` }
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink task",
        payload: { type: "unlink", task },
      }],
    });
  }, [task, taskId]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
      <ViewTask
        task={task}
        space={space}
        workspaces={workspaces}
        comments={comments}
        statuses={statuses}
        onCompleteChecklist={onCompleteChecklist}
        onNavigateToAddComment={onNavigateToAddComment}
      />
  );
};

export { ViewTaskPage };
