import { P1 } from "@deskpro/deskpro-ui";
import { useState } from "react";
import { CopyToClipboardInput, LoadingSpinner, OAuth2Result, useInitialisedDeskproAppClient, } from "@deskpro/app-sdk";
import styled from "styled-components";
import type { FC } from "react";
import type { Maybe } from "../../types";

const Description = styled(P1)`
  margin-top: 8px;
  /* margin-bottom: 16px; */
  color: ${({ theme }) => theme.colors.grey80};
`;

export const AdminCallback: FC<{ callbackUrl?: Maybe<string> }> = ({ callbackUrl }) => {
  if (!callbackUrl) {
    return (<LoadingSpinner />);
  }

  return (
    <>
      <CopyToClipboardInput value={callbackUrl} />
      <Description>The callback URL will be required during ClickUp app setup</Description>
    </>
  );
};

const AdminCallbackPage: FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);

  useInitialisedDeskproAppClient(async (client) => {
    const oauth2 = await client.startOauth2Local(
      ({callbackUrl, state }) => `https://app.clickup.com/api?response_type=code&client_id=xxx&state=${state}&redirect_uri=${callbackUrl}`,
      /code=(?<code>[0-9a-f]+)/,
      async (): Promise<OAuth2Result> => ({ data: { access_token: "", refresh_token: "" } })
    );

    const url = new URL(oauth2.authorizationUrl);
    const redirectUri = url.searchParams.get("redirect_uri");

    if (redirectUri) {
      setCallbackUrl(redirectUri);
    }
  });

  return (
    <AdminCallback callbackUrl={callbackUrl} />
  );
};

export { AdminCallbackPage };
