import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Space, Tag } from "./types";

const getTagsService = (
  client: IDeskproClient,
  spaceId: Space["id"],
) => {
  return baseRequest<{ tags: Tag[] }>(client, {
    url: `/space/${spaceId}/tag`,
  });
};

export { getTagsService };
