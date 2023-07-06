import { useState, useCallback } from "react";
import get from "lodash/get";
import noop from "lodash/noop";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../services/deskpro";
import type { TicketContext } from "../types";
import type { Task } from "../services/clickUp/types";

type UseUnlinkTask = () => {
  isLoading: boolean,
  unlink: (task: Task) => void,
};

const useUnlinkTask: UseUnlinkTask = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const unlink = useCallback((task?: Task) => {
    if (!client || isEmpty(task)) {
      return;
    }

    setIsLoading(true);
    Promise.all([
      deleteEntityService(client, ticketId, task.id),
    ])
      .then(() => {
        setIsLoading(false);
        navigate("/home");
      })
      .catch(noop);
  }, [client, ticketId, navigate]);

  return { isLoading, unlink };
};

export { useUnlinkTask };
