import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Space, List } from "./types";

const getFolderlessListsService = (
  client: IDeskproClient,
  spaceId: Space["id"],
) => {
  return baseRequest<{ lists: List[] }>(client, {
    url: `/space/${spaceId}/list`,
  });
};

export { getFolderlessListsService };
