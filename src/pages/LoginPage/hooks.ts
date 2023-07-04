import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
  OAuth2CallbackUrl,
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { setAccessTokenService } from "../../services/deskpro";
import {
  getAccessTokenService,
  getCurrentUserService,
} from "../../services/clickUp";
import { getQueryParams } from "../../utils";
import { useAsyncError } from "../../hooks";
import type { TicketContext } from "../../types";

type UseLogin = () => {
  poll: () => void,
  authUrl: string|null,
  isLoading: boolean,
};

const useLogin: UseLogin = () => {
  const navigate = useNavigate();
  const [callback, setCallback] = useState<OAuth2CallbackUrl|null>(null);
  const [authUrl, setAuthUrl] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const clientId = useMemo(() => get(context, ["settings", "client_id"]), [context]);

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        const callback: OAuth2CallbackUrl = await client
          .oauth2()
          .getCallbackUrl("code", /code=(?<token>[\d\w]+)/, {
            pollInterval: 2000,
          });

        setCallback(() => callback);
      })();
    },
    [setCallback]
  );

  useEffect(() => {
    if (callback?.callbackUrl && clientId) {
      setAuthUrl(`https://app.clickup.com/api?${getQueryParams({
        client_id: clientId,
        redirect_uri: callback?.callbackUrl,
      })}`);
    }
  }, [callback, clientId]);

  const poll = useCallback(() => {
    if (!client || !callback?.poll) {
      return;
    }

    setTimeout(() => setIsLoading(true), 1000);

    callback.poll()
      .then(({ statePathPlaceholder }) => getAccessTokenService(client, statePathPlaceholder))
      .then(({ access_token }) => setAccessTokenService(client, access_token))
      .then(() => getCurrentUserService(client))
      .then(({ user }) => get(user, ["id"]) && navigate("/home"))
      .catch(asyncErrorHandler);
  }, [client, callback, navigate, asyncErrorHandler]);

  return { authUrl, poll, isLoading };
};

export { useLogin };
