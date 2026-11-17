import type { ClickUpAPIError } from "./types";

export type InitData = {
  status: number,
  data: ClickUpAPIError,
};

class ClickUpError extends Error {
  status: number;
  data: ClickUpAPIError;

  constructor({ status, data }: InitData) {
    const message = "ClickUp Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

/**
 * Whether an error means the agent is not (or no longer) authenticated with ClickUp.
 * ClickUp answers a missing, invalid or revoked token with HTTP 401 and a variety of
 * error messages (e.g. "Oauth token not found", OAUTH_019), so match on the status.
 */
const isAuthError = (e: unknown): boolean => {
  return e instanceof ClickUpError
    && (e.status === 401 || e.data?.err === "Authorization header required");
};

export { ClickUpError, isAuthError };
