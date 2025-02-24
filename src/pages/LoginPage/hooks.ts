import { getAccessTokenService, } from "../../services/clickUp";
import { OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
import { getEntityListService, } from "../../services/deskpro";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import type { Settings, TicketData } from "../../types";

type UseLogin = () => {
  onSignIn: () => void,
  authUrl: string | null,
  error: null | string,
  isLoading: boolean,
};

const useLogin: UseLogin = () => {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const navigate = useNavigate();
  const ticketId = context?.data?.ticket.id;


  useInitialisedDeskproAppClient(async (client) => {

    if (context?.settings.use_deskpro_saas === undefined || !ticketId) {
      // Make sure settings have loaded.
      return;
    }

    const clientId = context?.settings.client_id;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

    if (mode === 'local' && typeof clientId !== 'string') {
      // Local mode requires a clientId.
      return;
    }

    const oauth2 =
      mode === 'local'
        // Local Version (custom/self-hosted app)
        ? await client.startOauth2Local(
          ({ state, callbackUrl }) => {
            return `https://app.clickup.com/api?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${callbackUrl}`;
          },
          /\bcode=(?<code>[^&#]+)/,
          async (code: string): Promise<OAuth2Result> => {
            // Extract the callback URL from the authorization URL
            const url = new URL(oauth2.authorizationUrl);
            const redirectUri = url.searchParams.get("redirect_uri");

            if (!redirectUri) {
              throw new Error("Failed to get callback URL");
            }

            const data = await getAccessTokenService(client, code);

            return { data }
          }
        )

        // Global Proxy Service
        : await client.startOauth2Global("C2CN2TBIOAZV6IC61BVL6LLQICE9CD8V");

    setAuthUrl(oauth2.authorizationUrl)
    setIsLoading(false)

    try {
      const result = await oauth2.poll()

      await client.setUserState("oauth2/access_token", result.data.access_token, { backend: true })
      if (result.data.refresh_token) {
        await client.setUserState("oauth2/refresh_token", result.data.refresh_token, { backend: true })
      }

      const linkedTickets = await getEntityListService(client, ticketId)

      if (linkedTickets.length > 0) {
        navigate("/home")
      } else {
        navigate("/link")
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsLoading(false);
    }
  }, [setAuthUrl, context?.settings.client_id, context?.settings.use_deskpro_saas]);

  const onSignIn = useCallback(() => {
    setIsLoading(true);
    window.open(authUrl ?? "", '_blank');
  }, [setIsLoading, authUrl]);


  return { authUrl, onSignIn, error, isLoading };
};

export { useLogin };
