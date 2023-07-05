import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedTasks } from "../../hooks";
import { Home } from "../../components";
import type { FC } from "react";

const HomePage: FC = () => {
  const { isLoading, tasks, workspaces } = useLinkedTasks();

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
    <Home tasks={tasks} workspaces={workspaces} />
  );
};

export { HomePage };
