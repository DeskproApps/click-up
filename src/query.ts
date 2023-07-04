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
}

export { queryClient, QueryKey };
