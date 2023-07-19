import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Tag, Space } from "./types";

const createTagService = (
  client: IDeskproClient,
  spaceId: Space["id"],
  tag: Pick<Tag, "name"|"tag_bg"|"tag_fg">,
) => {
  return baseRequest<void>(client, {
    url: `/space/${spaceId}/tag`,
    method: "POST",
    data: { tag },
  });
};

export { createTagService };
