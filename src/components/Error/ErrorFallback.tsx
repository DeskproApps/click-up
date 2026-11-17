import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Stack } from "@deskpro/deskpro-ui";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { ClickUpError, isAuthError } from "../../services/clickUp";
import { shouldRedirectToLogin } from "../../hooks/useAuthErrorRedirect";
import { ErrorBlock } from "../common";
import { Container } from "../common";
import type { FC } from "react";
import type { FallbackRender } from "@sentry/react";

/** An auth error that reached the error boundary sends the agent to log in again */
const AuthErrorRedirect: FC<{ resetError: () => void }> = ({ resetError }) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
    resetError();
  }, [navigate, resetError]);

  return <LoadingSpinner />;
};

const ErrorMessage: FC<{ error: unknown, resetError: () => void }> = ({ error, resetError }) => {
  const { pathname } = useLocation();

  if (isAuthError(error) && shouldRedirectToLogin(pathname)) {
    return <AuthErrorRedirect resetError={resetError} />;
  }

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

const ErrorFallback: FallbackRender = ({ error, resetError }) => (
  <ErrorMessage error={error} resetError={resetError} />
);

export { ErrorFallback };
