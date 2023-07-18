import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { CheckList, CheckListItem } from "./types";

const editChecklistItemService = (
  client: IDeskproClient,
  checklistId: CheckList["id"],
  checklistItemId: CheckListItem["id"],
  resolved: boolean,
) => {
  return baseRequest<{ checklist: CheckList }>(client, {
    url: `/checklist/${checklistId}/checklist_item/${checklistItemId}`,
    method: "PUT",
    data: { resolved },
  })
};

export { editChecklistItemService };
