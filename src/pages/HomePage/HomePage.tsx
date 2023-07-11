import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedTasks } from "../../hooks";
import { Home } from "../../components";
import type { FC } from "react";
import type { Task } from "../../services/clickUp/types";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { isLoading, tasks, workspaces } = useLinkedTasks();

  const onNavigateToTask = useCallback((taskId: Task["id"]) => {
    navigate(`/view/${taskId}`);
  }, [navigate]);

  useSetTitle("ClickUp");
  useSetBadgeCount(tasks);

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/link" },
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Log Out",
        payload: {
          type: "logout",
        },
      }],
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Home
      tasks={tasks}
      workspaces={workspaces}
      onNavigateToTask={onNavigateToTask}
    />
  );
};

export { HomePage };
