import { useState, useEffect, useMemo, useCallback, useContext, createContext } from "react";
import get from "lodash/get";
import size from "lodash/size";
import map from "lodash/map";
import has from "lodash/has";
import truncate from "lodash/truncate";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedTasks } from "./useLinkedTasks";
import { getEntityListService } from "../services/deskpro";
import { createTaskCommentService, getCurrentUserService } from "../services/clickUp";
import { queryClient } from "../query";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { Task } from "../services/clickUp/types";
import type { TicketContext, TicketData } from "../types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (taskId: Task["id"], selected: boolean, type: ReplyBoxType) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (taskId: Task["id"], type: ReplyBoxType) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (taskId: Task["id"], type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const noteKey = (ticketId: string, taskId: Task["id"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/notes/selection/${taskId}`.toLowerCase();
};

const emailKey = (ticketId: string, taskId: Task["id"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/emails/selection/${taskId}`.toLowerCase();
};

const registerReplyBoxNotesAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  taskIds: Array<Task["id"]>,
  tasksMap: Record<Task["id"], Task>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(taskIds) && !size(taskIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`);
  }

  return Promise
    .all(taskIds.map((taskId: Task["id"]) => client.getState<{ selected: boolean }>(noteKey(ticketId, taskId))))
    .then((flags) => {
      client.registerTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`, "reply_box_note_item_selection", {
        title: "Add to ClickUp",
        payload: taskIds.map((taskId, idx) => ({
          id: taskId,
          title: has(tasksMap, [taskId, "name"]) ? truncate(tasksMap[taskId].name, { length: 20 }) : taskId,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    })
    ;
};

const registerReplyBoxEmailsAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  taskIds: Array<Task["id"]>,
  tasksMap: Record<Task["id"], Task>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(taskIds) && !size(taskIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`);
  }

  return Promise
    .all(taskIds.map((taskId: Task["id"]) => {
      return client.getState<{ selected: boolean }>(emailKey(ticketId, taskId))
    }))
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`, "reply_box_email_item_selection", {
        title: `Add to ClickUp`,
        payload: taskIds.map((taskId, idx) => ({
          id: taskId,
          title: has(tasksMap, [taskId, "name"]) ? truncate(tasksMap[taskId].name, { length: 25 }) : taskId,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    });
};

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: () => {},
  getSelectionState: () => {},
  deleteSelectionState: () => {},
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext<TicketContext,unknown>()
  const { client } = useDeskproAppClient();

  const [tasks, setTasks] = useState<Task[]>([]);

  // Ensure the user is authenticated before fetching tasks (This is a temporary fix)

  useEffect(() => {
    if (client) {
      getCurrentUserService(client)
        .then(() => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const { tasks: tempTasks } = useLinkedTasks(); 
          setTasks(tempTasks);
        })
        .catch(() => {
          setTasks([]); 
        });
    }
  }, [client])

  const tasksMap = useMemo(() => (Array.isArray(tasks) ? tasks : []).reduce<Record<Task["id"], Task>>((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {}), [tasks]);

  const ticketId = get(context, ["data", "ticket", "id"]);
  const isCommentOnNote = get(context, ["settings", "default_comment_on_ticket_note"]);
  const isCommentOnEmail = get(context, ["settings", "default_comment_on_ticket_reply"]);

  const setSelectionState: SetSelectionState = useCallback((taskId, selected, type) => {
    if (!ticketId || !client) {
      return
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(noteKey(ticketId, taskId), { id: taskId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((taskIds) => registerReplyBoxNotesAdditionsTargetAction(client, ticketId, taskIds, tasksMap))
        .catch(() => {})
    }

    if (type === "email" && isCommentOnEmail) {
      return client?.setState(emailKey(ticketId, taskId), { id: taskId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((taskIds) => registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, taskIds, tasksMap))
        .catch(() => {})
    }
  }, [client, ticketId, isCommentOnNote, isCommentOnEmail, tasksMap]);

  const getSelectionState: GetSelectionState = useCallback((taskId, type) => {
    if (!ticketId) {
      return
    }

    const key = (type === "email") ? emailKey : noteKey;
    return client?.getState<string>(key(ticketId, taskId))
  }, [client, ticketId]);

  const deleteSelectionState: DeleteSelectionState = useCallback((taskId, type) => {
    if (!ticketId || !client) {
      return;
    }

    const key = (type === "email") ? emailKey : noteKey;

    return client.deleteState(key(ticketId, taskId))
      .then(() => getEntityListService(client, ticketId))
      .then((taskIds) => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, ticketId, taskIds, tasksMap);
      })
  }, [client, ticketId, tasksMap]);

  useInitialisedDeskproAppClient((client) => {

    if(!ticketId) return

    if (isCommentOnNote) {
      registerReplyBoxNotesAdditionsTargetAction(client, ticketId, map(tasks, "id"), tasksMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(tasks, "id"), tasksMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [tasks, ticketId, isCommentOnNote, isCommentOnEmail, tasksMap]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const subjectTicketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
          .then((selections) => {
            const taskIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as Task["id"]);

            return Promise
              .all(taskIds.map((taskId) => createTaskCommentService(client, taskId, { comment_text: email })))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const subjectTicketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
          .then((selections) => {
            const taskIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as Task["id"]);

            return Promise
              .all(taskIds.map((taskId) => createTaskCommentService(client, taskId, { comment_text: note })))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(emailKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {

                if (result.isSuccess) {
                  registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(tasks, "id"), tasksMap);
                }
              });
          }
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(noteKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxNotesAdditionsTargetAction(client, subjectTicketId, map(tasks, "id"), tasksMap);
                }
              });
          }
        })
      })
      .run(),
    200
  );

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider };
