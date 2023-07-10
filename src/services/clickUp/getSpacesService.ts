import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Space, Workspace } from "./types";

const getSpacesService = (
  client: IDeskproClient,
  workspaceId: Workspace["id"],
) => {
  return baseRequest<{ spaces: Space[] }>(client, {
    url: `/team/${workspaceId}/space`,
  });
};

export { getSpacesService };
