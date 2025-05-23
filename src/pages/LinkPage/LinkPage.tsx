import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import size from "lodash/size";
import cloneDeep from "lodash/cloneDeep";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityService } from "../../services/deskpro";
import { useTasks } from "./hooks";
import { getFilteredTasks, getEntityMetadata } from "../../utils";
import {
  useSetTitle,
  useReplyBox,
  useAsyncError,
  useDeskproTag,
  useLinkedAutoComment,
} from "../../hooks";
import { LinkTasks } from "../../components";
import type { FC } from "react";
import type { Maybe, Settings, TicketData } from "../../types";
import type { Task, Workspace } from "../../services/clickUp/types";

const LinkPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Maybe<Settings>>();
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkComment } = useLinkedAutoComment();
  const { setSelectionState } = useReplyBox();
  const { addDeskproTag } = useDeskproTag();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<Workspace["id"]|null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { workspaces, tasks, spaces, isLoading } = useTasks(selectedWorkspaceId);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const onChangeSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onNavigateToCreateTask = useCallback(() => navigate("/create"), [navigate]);

  const onChangeSelectedTask = useCallback((task: Task) => {
    let newSelectedTasks = cloneDeep(selectedTasks);

    if (selectedTasks.some(({ id }) => task.id === id)) {
      newSelectedTasks = selectedTasks.filter((selectedTask) => selectedTask.id !== task.id);
    } else {
      newSelectedTasks.push(task);
    }

    setSelectedTasks(newSelectedTasks);
  }, [selectedTasks]);

  const onLinkTasks = useCallback(() => {
    if (!client || !ticketId || !size(selectedTasks)) {
      return;
    }

    setIsSubmitting(true);
    Promise.all([
      ...selectedTasks.map((task) => setEntityService(
        client,
        ticketId,
        task.id,
        getEntityMetadata(task, workspaces, spaces)),
      ),
      ...selectedTasks.map((task) => addLinkComment(task.id)),
      ...selectedTasks.map((task) => addDeskproTag(task)),
      ...selectedTasks.map((task) => setSelectionState(task.id, true, "email")),
      ...selectedTasks.map((task) => setSelectionState(task.id, true, "note")),
    ])
      .then(() => {
        setIsSubmitting(false);
        navigate("/home");
      })
      .catch(asyncErrorHandler);
  }, [
    client,
    navigate,
    ticketId,
    selectedTasks,
    asyncErrorHandler,
    addLinkComment,
    setSelectionState,
    addDeskproTag,
    workspaces,
    spaces,
  ]);

  useSetTitle("Link Tasks");

  // At the beginning, we choose the first workspace
  useEffect(() => {
    setSelectedWorkspaceId(get(workspaces, [0, "id"], null));
  }, [workspaces]);

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <LinkTasks
      tasks={getFilteredTasks(tasks, { query: searchQuery })}
      onCancel={onCancel}
      onChangeSearch={onChangeSearch}
      onLinkTasks={onLinkTasks}
      isSubmitting={isSubmitting}
      selectedTasks={selectedTasks}
      isLoading={isLoading}
      spaces={spaces}
      workspaces={workspaces}
      selectedWorkspaceId={selectedWorkspaceId}
      onChangeWorkspace={setSelectedWorkspaceId}
      onChangeSelectedTask={onChangeSelectedTask}
      onNavigateToCreateTask={onNavigateToCreateTask}
    />
  );
};

export { LinkPage };
