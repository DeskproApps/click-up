import { getAccessTokenService, } from "../../services/clickUp";
import { getEntityListService, } from "../../services/deskpro";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
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
  const [isPolling, setIsPolling] = useState(false)
  const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)

  const { context } = useDeskproLatestAppContext<TicketData, Settings>();

  const navigate = useNavigate();

  const ticketId = context?.data?.ticket.id;


  useInitialisedDeskproAppClient(async (client) => {

    if (!ticketId) {
      // Make sure settings have loaded.
      return;
    }

    const clientId = context?.settings.client_id;
    const mode = context?.settings.use_advanced_connect === false ? 'global' : 'local';

    if (mode === 'local' && (typeof clientId !== 'string' || clientId.trim() === "")) {
      // Local mode requires a clientId.
      setError("A client ID is required")
      return;
    }

    const oauth2Response =
      mode === 'local'
        // Local Version (custom/self-hosted app)
        ? await client.startOauth2Local(
          ({ state, callbackUrl }) => {
            return `https://app.clickup.com/api?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${callbackUrl}`;
          },
          /\bcode=(?<code>[^&#]+)/,
          async (code: string): Promise<OAuth2Result> => {
            // Extract the callback URL from the authorization URL
            const url = new URL(oauth2Response.authorizationUrl);
            const redirectUri = url.searchParams.get("redirect_uri");

            if (!redirectUri) {
              throw new Error("Failed to get callback URL");
            }

            const data = await getAccessTokenService(client, code);

            return { data }
          }
        )

        // Global Proxy Service
        : await client.startOauth2Global("CFNS68ATLVYX66UASKFL1FR5W5Q9RNXX");

    setAuthUrl(oauth2Response.authorizationUrl)
    setOAuth2Context(oauth2Response)

  }, [setAuthUrl, context?.settings.client_id, context?.settings.use_advanced_connect]);


  useInitialisedDeskproAppClient((client) => {
    if (!ticketId || !oauth2Context) {
      return
    }

    const startPolling = async () => {
      try {
        const result = await oauth2Context.poll()

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
      } finally {
        setIsLoading(false)
        setIsPolling(false)
      }
    }

    if (isPolling) {
      startPolling()
    }
  }, [isPolling, ticketId, oauth2Context, navigate])




  const onSignIn = useCallback(() => {
    setIsLoading(true)
    setIsPolling(true)
    window.open(authUrl ?? "", '_blank');
  }, [setIsLoading, authUrl]);


  return { authUrl, onSignIn, error, isLoading };
};

export { useLogin };
