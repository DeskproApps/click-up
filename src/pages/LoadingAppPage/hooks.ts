import get from "lodash/get";
import size from "lodash/size";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityListService } from "../../services/deskpro";
import { getCurrentUserService } from "../../services/clickUp";
import type { Maybe, Settings, TicketData } from "../../types";

type UseCheckAuth = () => void;

const useCheckAuth: UseCheckAuth = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<TicketData, Maybe<Settings>>();
  const ticketId = get(context, ["data", "ticket", "id"]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    getCurrentUserService(client)
      .then(() => getEntityListService(client, ticketId))
      .then((entityIds) => navigate(size(entityIds) ? "/home" : "/link"))
      .catch(() => navigate("/login"));
  }, [ticketId, navigate]);
};

export { useCheckAuth };
