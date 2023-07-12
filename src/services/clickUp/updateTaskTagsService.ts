import size from "lodash/size";
import { addTagToTaskService } from "./addTagToTaskService";
import { removeTagFromTaskService } from "./removeTagFromTaskService";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Task, Tag } from "./types";

const updateTaskTagsService = (
  client: IDeskproClient,
  taskId: Task["id"],
  { add, rem }: { add: Array<Tag["name"]>, rem: Array<Tag["name"]> },
): Array<Promise<void>> => {
  return [
    ...(!size(add) ? [Promise.resolve()] : add.map(
      (tagName) => addTagToTaskService(client, taskId, tagName)
    )),
    ...(!size(rem) ? [Promise.resolve()] : rem.map(
      (tagName) => removeTagFromTaskService(client, taskId, tagName)
    )),
  ];
};

export { updateTaskTagsService };
