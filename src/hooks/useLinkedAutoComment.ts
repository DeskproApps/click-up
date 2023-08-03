import { useCallback, useState } from "react";
import get from "lodash/get";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { createTaskCommentService } from "../services/clickUp";
import type { Task, CreatedComment } from "../services/clickUp/types";
import type { TicketContext } from "../types";

export type Result = {
  isLoading: boolean,
  addLinkComment: (taskId: Task["id"]) => Promise<void|CreatedComment>,
  addUnlinkComment: (taskId: Task["id"]) => Promise<void|CreatedComment>,
};

const getLinkedMessage = (ticketId: string, link?: string): string => {
  return `Linked to Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const getUnlinkedMessage = (ticketId: string, link?: string): string => {
  return `Unlinked from Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const useLinkedAutoComment = (): Result => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isEnable = get(context, ["settings", "add_comment_when_linking"], false);
  const ticketId = get(context, ["data", "ticket", "id"]);
  const permalink = get(context, ["data", "ticket", "permalinkUrl"]);

  const addLinkComment = useCallback((taskId: Task["id"]) => {
    if (!client || !isEnable) {
      return Promise.resolve();
    }

    setIsLoading(true);
    return createTaskCommentService(client, taskId, { comment_text: getLinkedMessage(ticketId, permalink) })
      .finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink]);

  const addUnlinkComment = useCallback((taskId: Task["id"]) => {
    if (!client || !isEnable) {
      return Promise.resolve();
    }

    setIsLoading(true)
    return createTaskCommentService(client, taskId, { comment_text: getUnlinkedMessage(ticketId, permalink) })
      .finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink]);

  return { isLoading, addLinkComment, addUnlinkComment };
};

export {
  getLinkedMessage,
  getUnlinkedMessage,
  useLinkedAutoComment,
};
