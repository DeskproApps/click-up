import { H3, P3 } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { Container, AnchorButton } from "../common";
import type { FC } from "react";

type Props = {
  authUrl: string|null,
  poll: () => void,
  isLoading: boolean,
  error: string | null,
};

const Login: FC<Props> = ({ authUrl, poll, isLoading, error }) => (
  <Container>
    <Title as={H3} title="Log into your ClickUp Account" />
    <AnchorButton
      intent="secondary"
      text="Log In"
      target="_blank"
      href={authUrl || "#"}
      onClick={poll}
      loading={isLoading}
      disabled={!authUrl || isLoading}
    />

<br/>
    {error && <P3>{error}</P3>}
  </Container>
);

export { Login };
