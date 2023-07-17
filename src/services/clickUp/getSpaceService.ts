import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Space } from "./types";

const getSpaceService = (
  client: IDeskproClient,
  spaceId: Space["id"],
) => {
  return baseRequest<Space>(client, {
    url: `/space/${spaceId}`,
  });
};

export { getSpaceService };
