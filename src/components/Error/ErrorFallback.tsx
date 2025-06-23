import { Stack } from "@deskpro/deskpro-ui";
import { ClickUpError } from "../../services/clickUp";
import { ErrorBlock } from "../common";
import { Container } from "../common";
import { FallbackRender } from "@sentry/react";

const ErrorFallback: FallbackRender = ({ error }) => {
  let message = "An unexpected error occurred.";
  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof ClickUpError && typeof error.data.err === "string" && error.data.err.trim() !== "") {
    message = error.data.err
  } else if (error instanceof Error && error.message.trim() !== "") {
    message = error.message
  }

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
