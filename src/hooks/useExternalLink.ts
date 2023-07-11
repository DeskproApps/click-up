import { useCallback } from "react";
import { CLICK_UP_URL } from "../constants";
import type { Workspace, Project } from "../services/clickUp/types";

export type Result = {
  getWorkspaceUrl: (workspaceId: Workspace["id"]) => string,
  getProjectUrl: (workspaceId: Workspace["id"], projectId: Project["id"]) => string,
};

const useExternalLink = (): Result => {
  const getWorkspaceUrl = useCallback((workspaceId: Workspace["id"]) => {
    if (!workspaceId) {
      return "";
    } else {
      return `${CLICK_UP_URL}/${workspaceId}`;
    }
  }, []);

  const getProjectUrl = useCallback((workspaceId: Workspace["id"], projectId: Project["id"]) => {
    if (!projectId) {
      return "";
    } else {
      return `${CLICK_UP_URL}/${workspaceId}/v/f/${projectId}`;
    }
  }, []);

  return { getWorkspaceUrl, getProjectUrl };
};

export { useExternalLink };
