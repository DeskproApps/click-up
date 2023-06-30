import { Stack } from "@deskpro/deskpro-ui";
import { ClickUpError } from "../../services/clickUp";
import { ErrorBlock } from "../common";
import { Container } from "../common";
import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

type Props = Omit<FallbackProps, "error"> & {
  error: Error,
};

const ErrorFallback: FC<Props> = ({ error }) => {
  const message = "There was an error!";
  const button = null;

  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof ClickUpError) {
    //...
  }

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
            {button}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
