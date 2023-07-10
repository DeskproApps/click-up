import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Space, Folder } from "./types";

const getFoldersService = (
  client: IDeskproClient,
  spaceId: Space["id"],
) => {
  return baseRequest<{ folders: Folder[] }>(client, {
    url: `/space/${spaceId}/folder`,
  });
};

export { getFoldersService };
