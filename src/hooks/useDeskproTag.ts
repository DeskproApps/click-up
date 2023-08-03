import { useCallback, useMemo } from "react";
import get from "lodash/get";
import noop from "lodash/noop";
import isEmpty from "lodash/isEmpty";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {
  getTagsService,
  createTagService,
  addTagToTaskService,
  removeTagFromTaskService,
} from "../services/clickUp";
import { findDeskproTag } from "../utils";
import { DESKPRO_TAG } from "../constants";
import type { TicketContext } from "../types";
import type { Task } from "../services/clickUp/types";

type UseDeskproTag = () => {
  addDeskproTag: (task: Task) => Promise<void|{ data: void }>,
  removeDeskproTag: (task: Task) => Promise<void|{ data: void }>,
};

const useDeskproTag: UseDeskproTag = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };

  const isAddDeskproTag = useMemo(() => {
    return get(context, ["settings", "add_deskpro_tag"]) === true
  }, [context]);

  const addDeskproTag = useCallback((task: Task) => {
    if (!client || !isAddDeskproTag || isEmpty(task)) {
      return Promise.resolve();
    }

    return getTagsService(client, task.space.id)
      .then(({ tags }) => {
        const deskproTag = findDeskproTag(tags);

        return deskproTag
          ? Promise.resolve()
          : createTagService(client, task.space.id, DESKPRO_TAG);
      })
      .then(() => addTagToTaskService(client, task.id, DESKPRO_TAG.name))
      .catch(noop);
  }, [client, isAddDeskproTag]);

  const removeDeskproTag = useCallback((task: Task) => {
    if (!client || !isAddDeskproTag) {
      return Promise.resolve();
    }

    const deskproTag = findDeskproTag(get(task, ["tags"]));

    return (deskproTag
        ? removeTagFromTaskService(client, task.id, deskproTag.name)
        : Promise.resolve()
    ).catch(noop)
  }, [client, isAddDeskproTag]);

  return { addDeskproTag, removeDeskproTag };
};

export { useDeskproTag };
