import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

enum QueryKey {
  WORKSPACES = "workspaces",
  TASKS_BY_WORKSPACE = "tasksByWorkspace",
  LINKED_TASKS = "linkedTasks",
  TASK = "task",
  TASK_COMMENTS = "taskComments",
  SPACES = "spaces",
  FOLDERS = "folders",
  FOLDERLESS_LISTS = "folderlessLists",
  TAGS = "tags",
}

export { queryClient, QueryKey };
