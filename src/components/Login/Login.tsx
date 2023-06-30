import { H3, Title } from "@deskpro/app-sdk";
import { Container, AnchorButton } from "../common";
import type { FC } from "react";

type Props = {
  authUrl: string|null,
  poll: () => void,
  isLoading: boolean,
};

const Login: FC<Props> = ({ authUrl, poll, isLoading }) => (
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
  </Container>
);

export { Login };
