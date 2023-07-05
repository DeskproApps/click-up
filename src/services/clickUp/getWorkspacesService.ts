import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Workspace } from "./types";

const getWorkspacesService = (client: IDeskproClient) => {
  return baseRequest<{ teams: Workspace[] }>(client, {
    url: "/team",
  });
};

export { getWorkspacesService };
