import { useState, useMemo } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { P1 } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  CopyToClipboardInput,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import type { FC } from "react";
import type { Maybe } from "../../types";

const Description = styled(P1)`
  margin-top: 8px;
  /* margin-bottom: 16px; */
  color: ${({ theme }) => theme.colors.grey80};
`;

export const AdminCallback: FC<{ callbackUrl?: Maybe<string> }> = ({ callbackUrl }) => {
  if (!callbackUrl) {
    return (<LoadingSpinner/>);
  }

  return (
    <>
      <CopyToClipboardInput value={callbackUrl} />
      <Description>The callback URL will be required during ClickUp app setup</Description>
    </>
  );
};

const AdminCallbackPage: FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<string|null>(null);
  const key = useMemo(() => uuidv4(), []);

  useInitialisedDeskproAppClient((client) => {
    client.oauth2()
      .getAdminGenericCallbackUrl(key, /code=(?<token>[0-9a-f]+)/, /state=(?<key>.+)/)
      .then(({ callbackUrl }) => setCallbackUrl(callbackUrl));
  }, [key]);

  return (
    <AdminCallback callbackUrl={callbackUrl} />
  );
};

export { AdminCallbackPage };
