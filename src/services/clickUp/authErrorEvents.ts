type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Subscribe to ClickUp rejecting the agent's access token (missing, invalid or revoked).
 * Returns a function that unsubscribes.
 */
const onAuthError = (listener: Listener): () => void => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const notifyAuthError = (): void => {
  listeners.forEach((listener) => listener());
};

export { onAuthError, notifyAuthError };
